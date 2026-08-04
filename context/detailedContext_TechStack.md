# WEVHUN Tech Stack


### Programming Languages
* JavaScript
* TypeScript
* Python
* JSX

### Frameworks and Libraries
* Xterm.js (planned to be used in the Terminal Tool)
* Monaco Editor (planned to be used in the Source Tool)
* Playwright (planned to be used in the Browser Tool)
* Node.js 
* React (main frontend framework managing the UI)
* Tailwind (main CSS framework handling all styling)
* vite (for testing)
* Zustand (responsible for state)
* Electron (Responsible for the actual window and app itself)
* Express (planned use in the future with potential future tools)

### Source Code Pieces and their language designaions (How they should be handled)
* React Components = needs to be Written in jsx
* src/common/ source files and utilities = needs to prioritize TypeScript when possible
* Application State = needs to prioritize Zustand when possible instad of react context