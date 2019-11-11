## 0.0.2 - 2019-11-11
Removing the triage label when the issue is closed. In order for this to work for already configured workflows, the `closed` event action must be added to the `issues` event types array:
```diff
issues:
-  types: [opened, milestoned, demilestoned]
+  types: [opened, closed, milestoned, demilestoned]
```
Otherwise, the update won't have any effect whatsoever.

## 0.0.1 - 2019-11-08
Initial release.
