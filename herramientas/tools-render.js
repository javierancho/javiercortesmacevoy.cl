"use strict";

/*
==========================================================
Render automático de herramientas
==========================================================
*/

document.addEventListener("DOMContentLoaded", renderTools);

function renderTools() {

    const container = document.getElementById("toolsGrid");

    if (!container) {
        console.warn("No existe #toolsGrid");
        return;
    }

    container.innerHTML = "";

    SITE_TOOLS.forEach(group => {

        const groupDiv = document.createElement("div");
        groupDiv.className = "tool-group";

        //------------------------------------------
        // Título categoría
        //------------------------------------------

        const title = document.createElement("div");
        title.className = "tool-title";

        const icon = document.createElement("span");
        icon.className = "tool-icon " + group.iconClass;
        icon.textContent = group.iconText;

        const h3 = document.createElement("h3");

        h3.setAttribute("data-i18n", group.categoryKey);

        h3.textContent =
            document.documentElement.lang === "en"
            ? group.categoryEn
            : group.categoryEs;

        title.appendChild(icon);
        title.appendChild(h3);

        //------------------------------------------
        // Lista herramientas
        //------------------------------------------

        const list = document.createElement("div");
        list.className = "tool-list";

        group.tools.forEach(tool => {

            const link = document.createElement("a");

            link.className = "tool-link";

            link.href = tool.url;

            if (tool.analyticsTool) {

                link.dataset.analyticsTool =
                    tool.analyticsTool;

            }

            if (tool.analyticsEvent) {

                link.dataset.analyticsEvent =
                    tool.analyticsEvent;

            }

            const text = document.createElement("span");

            text.setAttribute("data-i18n", tool.key);

            text.textContent =
                document.documentElement.lang === "en"
                ? tool.titleEn
                : tool.titleEs;

            const arrow = document.createElement("span");
            arrow.textContent = "›";

            link.appendChild(text);
            link.appendChild(arrow);

            list.appendChild(link);

        });

        groupDiv.appendChild(title);
        groupDiv.appendChild(list);

        container.appendChild(groupDiv);

    });

}
