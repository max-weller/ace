/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;

var SsiLangHighlightRules = function() {
    
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "first" : [
            {
                token : ["keyword", "text", "support.class"],
                regex : "(\\w+)",
                next : "start"
            }
        ],
        "start" : [
            {
                token : "string", // " string start
                regex : '"',
                next : "qqstring"
            }, {
                token : "string", // ' string start
                regex : "'",
                next : "qstring"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : "entity.other.attribute-name.xml",
                regex : "\\b(\\w+)(=)"
            }, {
                token : "keyword.operator",
                regex : "="
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "qqstring" : [
            {token : "constant.language.escape", regex : /\\["\\]/},
            {token : "string", regex : '"', next : "start"},
            {defaultToken : "string"}
        ],
        "qstring" : [
            {token : "constant.language.escape", regex : /\\['\\]/},
            {token : "string", regex : "'", next : "start"},
            {defaultToken : "string"}
        ]
    };

};

oop.inherits(SsiLangHighlightRules, TextHighlightRules);


var SsiHighlightRules = function() {
    HtmlHighlightRules.call(this);

    var startRules = [
        {
            token : "support.ssi_tag", // php open tag
            regex : "<!--#",
            push  : "ssi-first"
        }
    ];

    var endRules = [
        {
            token : "support.ssi_tag", // php close tag
            regex : "-->",
            next  : "pop"
        }
    ];

    for (var key in this.$rules)
        this.$rules[key].unshift.apply(this.$rules[key], startRules);

    this.embedRules(SsiLangHighlightRules, "ssi-", endRules, ["start"]);

    this.normalizeRules();
};

oop.inherits(SsiHighlightRules, HtmlHighlightRules);

exports.SsiHighlightRules = SsiHighlightRules;
exports.SsiLangHighlightRules = SsiLangHighlightRules;
});







