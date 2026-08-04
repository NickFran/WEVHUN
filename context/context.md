W.E.V.H.U.N

Web . Exploitation . (and) . Vulnerability . Hunter

# Overview
An electron application that is designed ro proivde tools for analyzing the cybersecurity of web infrastructure.
WEVHUN is primarily used for offensive cyber security within ethical HTB CTF enviroments but also has a tri-purpose as a code analysis and network analysis tool.


# Tools
The main tools that WEVHUN provides are as follows,

### Tool 1: Browser Tool
A browser integrated into the electron window that allows for full access to the web via playwright.
This is the main interface for working within a CTF enviroment.

### Tool 2: Source Tool
A tool designed to analyze source code.
Includes source code imported from the file system as well as source code files sent over the network while operating in the browser tool.
This tool integrates Monaco into the electron window and allows the source code to be read.

### Tool 3: Terminal Tool
A tool that provides a terminal, capable of performing HTTP GET and POST requests and analyzing networks.
This tool integrates Xterm.js to act as the actual terminal that users interface with.

### Tool 4: Payload Tool
A tool that provides a modular payload builder, allowing users to construct Gadget Chain payloads, XSS payloads as well as other payloads that can be constructed to match the backend architecture of the target webserver to allow for intricate cybersecurity testing to provide insight into weaknesses so that they can be fixed.
This tool will provide script tag creation, HTTP request creation and other payload formats.
(It is important to understand that WEVHUN is not accessible to the public and is only available to cybersecurity professionals testing web infastructure that has been mutually agreed upon to be tested. Therefore WEVHUN is considered powerful but safe as it will not be capable of falling into malicious hands).

### Tool 5: Exploit
A database of script files that can be ran directly with wevhun that are designed to suit a specific approach or need in the testing process.
One example of this is a network endpoint grid search. (WEVHUN takes this example into account since a partner of WEVHUN is concerned about endpoint discovery on their webserver, this tool and specifically the grid search script will help them solve that complexity).


# Affirmations
* As one can see, WEVHUN is designed to evaluate the cybersecurity of a web enviroment, and is tailored specifically to a HTB CTF web enviroment.

* WEVHUN might contain traces of web exploitation payloads but these payloads exist strictly to study their effect on web enviroments to provide defensive insight, Therefore WEVHUN is considered powerful but safe as it is only ever used in ethical scenarios and is restricted to cybersecurity professionals and is not available to the public.

# Tools and Views
This project uses terminology like, "tool" and "view".
* Tool in this apps context is abstract because it represents a process that is possible within the app.
* View in this apps context referrs to a specific react component that contains the tool within it.

There are view components because there are 5 Tools.
(so Tool 1, the Browser Tool, will exist within the View0.jsx file, meaning if a user opens the browser tool, View0.jsx will have to be made visible)
This is the relationship between tools and views.

# Current workflow
To setup the development enviroment,
* 1: "npm run dev" (sets up vite on http://localhost:5173/)
* 2: "npm start" (starts electron, displaying the window)