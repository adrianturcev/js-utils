module.exports = {
    qs(cssSelector) {
        return document.querySelector(cssSelector);
    },

    qsa(cssSelector) {
        return Array.from(document.querySelector(cssSelector));
    },

    // # Nil
    // I like the NOT operator
    // I like strict type checking
    // Hence a strictly typed equivalent:
    // - 3-letters name n
    // - single argument

    /**
     * Nil
     * Either null or undefined
     * @param { boolean } exp
     * @returns { boolean }
     */
    nil(exp) { // values implicitly considered functions
        if (
            exp === null
            || typeof exp === 'undefined'
        ) {
            return true;
        }
        return false;
    },

    // # Hack

    // .slice() uses a closed-open interval
    // the mathematical convention goes closed-closed

    /**
     * Hack
     * @param { number } start
     * @param { number } end
     * @returns
     */
    hack(array, start, end) {
        return array.slice(start, end + 1);
    },

    // # Prune/Pick

    // Javascript inherited spreadsheet-like .filter()
    // It felt confusing there
    // It feels confusing here too

    /**
     * Pick
     * @param {*} array
     * @param {*} pruningFunction
     * @returns
     */
    pick(array, pruningFunction) {
        return array.filter(pruningFunction);
    },

    /**
     * Prune
     * The inverse of filter()
     * @param {*} array
     * @param {*} filteringFunction
     * @returns
     */
    prune(array, filteringFunction) {
        return array.filter(function (x) {
            return !filteringFunction(x);
        });
    },

    // # Check

    // .every() just sounds weird
    /**
     * Check
     * @param {*} array
     * @param {*} checkingFunction
     * @returns
     */
    check(array, checkingFunction) {
        return array.every(checkingFunction);
    },

    /**
     * Pipe
     * Function piping with initial input
     * @param {*} functions
     * @param {*} input
     * @returns {*}
     */
    pipe(input, ...functions) {
        return functions.reduce((res, fun) => fun(res), input);
    },

    /**
     * Escape
     * @param { string } string
     * @returns
     */
    escape(string) {
        return string
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /**
     * DOM-rendering template tag
     * @param {Array} strings
     * @returns {String}
     */
    html(strings) {
        let output = strings[0], // assumes empty string start?
            max = Math.max(strings.length, arguments.length - 1);
        for (let i = 1; i < max; i++) {
            output += arguments[i];
            output += strings[i];
        }
        return output;
    },

    /**
     * Basic contents updater
     * Assuming:
     * - Rendering applied event-listeners already
     * - You can apply state afterwards
     * - You can store newRender afterwards
     * @param {object} previousRender
     * @param {object} newRender
     * @param {object} dom
     */
    diffVDomAndUpdate(previousRender, newRender, dom) {
        // Assuming overwrite or insertion
        let $ =  this;
        $.changedNodes = [];
        let leftItems = previousRender.childNodes,
            rightItems = newRender.childNodes,
            domItems = dom.childNodes;
        if (domItems.length > rightItems.length) {
            let diffLength = domItems.length - rightItems.length;
            for (let i = 0, c = diffLength; i < c; i++) {
                dom.lastChild.remove();
            }
        }
        for (let i = 0, c = rightItems.length; i < c; i++) {
            if (!leftItems[i]) {
                let node = rightItems[i].cloneNode(true);
                $.changedNodes.push(node);
                dom.appendChild(node);
            } else if (leftItems[i].outerHTML !== rightItems[i].outerHTML) {
                let voidElementsList = [
                    'AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'META', 'PARAM', 'SOURCE',
                    'TRACK', 'WBR'
                ],
                    closingTagLength = 0;
                if (voidElementsList.indexOf(rightItems[i].tagName) === -1) {
                    closingTagLength = 3 + rightItems[i].tagName.length;
                }
                if (
                    leftItems[i].tagName !== rightItems[i].tagName
                    || leftItems[i].innerHTML === rightItems[i].innerHTML
                    || (
                        leftItems[i].outerHTML.slice((-1 * leftItems[i].innerHTML.length) - closingTagLength)
                        !==  rightItems[i].outerHTML.slice((-1 * rightItems[i].innerHTML.length) - closingTagLength)
                    )
                ) {
                    let node = rightItems[i].cloneNode(true);
                    $.changedNodes.push(node);
                    domItems[i].replaceWith(node);
                } else {
                    // Same container, different contents
                    this.diffVDomAndUpdate(leftItems[i], rightItems[i], domItems[i]);
                }
            }
        }
    },

    // # DATA-STATE

    // Alternative CSS state management
    // - using data-attributes instead of classes
    //     - easier to match model and vue
    //     - dataset over classlist allows specialization
    //     - classes work as booleans (".walked")
    //         - you need to notice abscence
    //     - data-state work as a string type you can dedicate to store state only, and more than one state

    /**
     * Add
     * @param { object } element
     * @param { string } state
     */
    addDataState(element, state) {
        let stateArray = [];
        if (
            element.dataset.state
        && element.dataset.state.indexOf(' ') > -1
        ) {
            stateArray = element.dataset.state.split(' ');
        } else {
            stateArray = [element.dataset.state];
        }
        if (stateArray.indexOf(state) === -1) {
            stateArray.push(state);
            element.dataset.state = stateArray.join(' ');
        }
    },

    /**
     * Remove
     * @param { object } element
     * @param { string } state
     */
    removeDataState(element, state) {
        let stateArray = [];
        if (
            element.dataset.state
        && element.dataset.state.indexOf(' ') > -1
        ) {
            stateArray = element.dataset.state.split(' ');
        } else {
            stateArray = [element.dataset.state];
        }
        element.dataset.state =
        stateArray
            .filter(element => (element !== state))
            .join(' ');
    },

    /**
     * Replace
     * @param { object } element
     * @param { string } stateToRemove
     * @param { string } stateToAdd
     */
    replaceDataState(element, stateToRemove, stateToAdd) {
        this.removeDataState(element, stateToRemove);
        this.addDataState(element, stateToAdd);
    },

    /**
     * Toggle
     * @param { object } element
     * @param { string } state
     */
    toggleDataState(element, state) {
        let stateArray = element.dataset.state.split(' ');
        if (stateArray.indexOf(state) == -1) {
            this.addDataState(element, state);
        } else {
            this.removeDataState(element, state);
        }
    },

    /**
     * Reset
     * @param { object } element
     */
    resetDataState(element) {
        element.dataset.state = '';
    },

    //# AJAX Functions

    /**
     * AJAX GET
     * @param {string} url The target url
     * @param {function} callback
     * @param {boolean} isJson Response contains json
     * @param {object} callbackContext
     */
    ajaxGet(url, callback, isJson, callbackContext) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                if (isJson) {
                    var json = {};
                    try {
                        json = JSON.parse(req.responseText);
                    } catch (error) {
                        console.error("Get request returned invalid JSON.")
                    }
                    callbackContext === undefined ? callback(json) : callback.apply(callbackContext, [json]);
                } else {
                    callbackContext === undefined ? callback(req.responseText) : callback.apply(callbackContext, [req.responseText]);
                }
            } else {
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.addEventListener("error", function () {
            console.error("Network error trying to access: " + url);
        });
        req.send(null);
    },

    /**
     * AJAX POST
     * @param {string} url
     * @param {string} data
     * @param {function} successCallback
     * @param {function} failureCallback
     * @param {boolean} isJson
     * @param {object} successCallbackContext
     * @param {object} failureCallbackContext
     */
    ajaxPost(url, data, successCallback, failureCallback, isJson, successCallbackContext, failureCallbackContext) {
        var req = new XMLHttpRequest();
        req.open("POST", url);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                successCallbackContext === undefined ? successCallback(req) : successCallback.apply(successCallbackContext, [req]);
            } else {
                failureCallbackContext === undefined ? failureCallback(req) : failureCallback.apply(failureCallbackContext, [req]);
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.addEventListener("error", function () {
            console.error("Network error trying to access: " + url);
        });
        if (isJson) {
            req.setRequestHeader("Content-Type", "application/json");
            data = JSON.stringify(data);
        }
        req.send(data);
    }
}
