const fs = require("fs").promises,
    core = require("@actions/core"),
    github = require("@actions/github");

const token = core.getInput("github-token", { required: true }),
    label = getInput("label", "triage"),
    project = getInput("project", "true") == "true",
    milestone = getInput("milestone", "true") == "true",
    context = github.context,
    owner = context.repo.owner,
    repo = context.repo.repo,
    client = new github.GitHub(token);

const getEvent = async () => JSON.parse(await fs.readFile(process.env["GITHUB_EVENT_PATH"]));

function getInput(name, fallback) {
    const input = core.getInput(name);
    return input || fallback;
}

async function run() {
    try {
        core.debug(JSON.stringify(context.payload));
        if (!project && !milestone) {
            core.info("At least one setting must be enabled: \"project\" or \"milestone\".");
            return;
        }
        if (!["issues", "project_card"].includes(github.context.eventName)) {
            core.info("This action is supposed to run for issues and projects only. Stepping out...");
            return;
        }
        const event = await getEvent();
        if (!["milestoned", "demilestoned", "created", "deleted"].includes(event.action)) {
            core.info("This action is supposed to run for milestone and project changes and issue creation only. Stepping out...");
            return;
        }
        switch (github.context.eventName) {
            case "issue":
                if (event.action != "created" && !milestone) {
                    core.info("Milestone is disbled. Consider removing the \"milestoned\" and \"demilestoned\" from the trigger types. Stepping out...");
                    return;
                }
                break;

            case "project_card":
                if (!project) {
                    core.info("Project is disabled. Consider removing the \"project_card\" from the trigger events. Stepping out...");
                    return;
                }
                break;
        }
        if (context.payload.issue.state != "open") {
            core.info("Issue is not open. Stepping out...");
            return;
        }
        await triage();
    }
    catch (err) {
        //Even if it's a valid situation, we want to fail the action in order to be able to find the issue and fix it.
        core.setFailed(err.message);
        core.debug(JSON.stringify(err));
    }
}

function labelMap(label) {
    return label.name;
}

async function projectContained() {
    let projectPage = 0,
        projectsResult;
    do {
        core.info(`Projects page ${++projectPage}:`);
        projectsResult = await client.projects.listForRepo({
            owner,
            page: projectPage,
            repo,
        });
        core.debug(JSON.stringify(projectsResult.data));
        for (const project of projectsResult.data) {
            let columnPage = 0,
                columnsResult;
            do {
                core.info(`Columns page ${++columnPage}:`);
                columnsResult = await client.projects.listColumns({
                    project_id: project.id,
                });
                core.debug(JSON.stringify(columnsResult.data));
                for (const column of columnsResult.data) {
                    let cardPage = 0,
                        cardsResult;
                    do {
                        core.info(`Cards page ${++cardPage}:`);
                        cardsResult = await client.projects.listCards({
                            column_id: column.id
                        });
                        core.debug(JSON.stringify(cardsResult.data));
                        for (const card of cardsResult.data) {
                            const items = card.url.split('/');
                            const id = items[items.length - 1];
                            if (context.payload.issue.number == id) {
                                return true;
                            }
                        }
                    } while (cardsResult.data.length == 100);
                }
            } while (columnsResult.data.length == 100);
        }
    } while (projectsResult.data.length == 100);
    return false;
}

async function triage() {
    const isTriage = milestone && !context.payload.issue.milestone && project && !await projectContained();
    const isLabeled = context.payload.issue.labels.map(labelMap).includes(label);
    if (isTriage && !isLabeled) {
        core.info(`Applying "${label}" label...`);
        const labelResponse = await client.issues.addLabels({
            issue_number: context.issue.number,
            labels: [label],
            owner,
            repo,
        });
        core.debug(JSON.stringify(labelResponse.data));
    }
    else if (!isTriage && isLabeled) {
        core.info(`Removing "${label}" label...`);
        const labelResponse = await client.issues.removeLabel({
            issue_number: context.issue.number,
            label,
            owner,
            repo,
        });
        core.debug(JSON.stringify(labelResponse.data));
    }
    else {
        core.info("State hasn't changed. Skipping...");
    }
}

run();
