* add init state for history stack when browser init = DONE
* make react comps for undo and redo = DONE

* make browser tool functions for undo and redo
* probaly change browserTool.js export logic, just do one bug export potentially
* maybe make a new comp dir for pieces (make undo and redo modular idk maybe)

* for some reason, clicking the undo or redo buttons in View0 causes this error.
``Uncaught (in promise) Error: Error invoking remote method 'browser:navigate': Error: page.goto: Target page, context or browser has been closed``

* clicking on a link doesnt update the URL bar in the UI.