* add init state for history stack when browser init = DONE
* make react comps for undo and redo = DONE
* clicking on a link doesnt update the URL bar in the UI. = FIXED
* make browser tool functions for undo and redo = DONE
* maybe make a new comp dir for pieces (make undo and redo modular idk maybe) = DONE






* Zustand was not found on this repo instance for some reason, so I just did npm install zustand. This changed package.json from "zustand": "^5.0.14" TO  "zustand": "^5.0.15" (hopefully no issues)
* probaly change browserTool.js export logic, just do one bug export potentially

* for some reason, clicking the undo or redo buttons in View0 causes this error.
``Uncaught (in promise) Error: Error invoking remote method 'browser:navigate': Error: page.goto: Target page, context or browser has been closed``



* 'webContents.goForward' is deprecated and will be removed. Need use 'webContents.navigationHistory.goForward' instead.
* What to do about multiple windows when clicking links?
* add refresh btn
* auto open playwrights dev tools (or add debug btn on browser bar for it)
* terminal tool needs a dedicated HTTP button
* indent the terminal, it looks so much better and also 
* y overflow on terminal causes scroll bar to take up width, fix later
* add clear command to terminal Tool (it currently does nothing)
* add a copy btn at the top right of the command output blocks