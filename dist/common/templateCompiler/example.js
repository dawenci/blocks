export const template = (jsx) => {
    return (jsx.createElement("div", { class: "test", "bl-on": "click.once<-onClick" },
        jsx.createElement("div", { "bl-prop": "prop-name<-prop" }),
        jsx.createElement("input", { "bl-attr": "value<-title", "bl-on": "input<-onInput" }),
        jsx.createElement("p", { "bl-attr": "title<-title" },
            "prefix ",
            jsx.createElement("t", { text: "text" }),
            " suffix"),
        jsx.createElement("template", null,
            "\u6D4B\u8BD5Template",
            jsx.createElement("p", null, "\u6D4B\u8BD5 Template P")),
        jsx.createElement("if", { cond: "cond" },
            jsx.createElement("p", null,
                "\u5916\u5C42 IF block: ",
                jsx.createElement("t", { text: "cond" })),
            jsx.createElement("if", { cond: "cond2" },
                "\u5185\u5C42 if block ",
                jsx.createElement("t", { text: "cond2" }))),
        jsx.createElement("for", { each: "list1", as: "item1" },
            jsx.createElement("p", null,
                jsx.createElement("t", { text: "item1.name" }),
                " - ",
                jsx.createElement("t", { text: "item1.nested.value" }))),
        jsx.createElement("for", { each: "list2", as: "item" },
            jsx.createElement("div", { class: "list-item" },
                jsx.createElement("h3", null, "list item"),
                jsx.createElement("p", null,
                    "List Item: ",
                    jsx.createElement("t", { text: "item.itemName" }),
                    jsx.createElement("t", { text: "title" })))),
        jsx.createElement("rich", { html: "html" }),
        jsx.createElement("p", null,
            jsx.createElement("t", { text: "nestData.dot" })),
        jsx.createElement("p", null,
            jsx.createElement("t", { text: 'nestData[ "index1" ]' })),
        jsx.createElement("p", null,
            jsx.createElement("t", { text: "nestData['index2']" }))));
};