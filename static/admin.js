
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const initialCases = [
        {
            id: "SR-1042",
            type: "Delivery Dispute",
            customer: "Ahmed Khan",
            email: "ahmed@example.com",
            order: "ORD-2081",
            status: "Pending Review",
            priority: "High",
            created: "2026-10-16",
            summary: "Customer reports that the order has not arrived.",
            detail: "The customer says the expected delivery date has passed and requests an investigation.",
            orderStatus: "In Transit",
            expected: "2026-10-14",
            tracking: "TRK-700281",
            notes: [],
            reply: ""
        },
        {
            id: "SR-1040",
            type: "Address Change",
            customer: "Sara Ali",
            email: "sara@example.com",
            order: "ORD-2078",
            status: "Pending Review",
            priority: "High",
            created: "2026-10-16",
            summary: "Customer requests a delivery address change.",
            detail: "The customer wants the delivery address checked before the order is dispatched.",
            orderStatus: "Processing",
            expected: "2026-10-20",
            tracking: "Not available",
            notes: [],
            reply: ""
        },
        {
            id: "SR-1038",
            type: "Cancellation",
            customer: "Bilal Ahmed",
            email: "bilal@example.com",
            order: "ORD-2072",
            status: "In Progress",
            priority: "Medium",
            created: "2026-10-15",
            summary: "Customer asks to cancel an order.",
            detail: "The order must be checked to determine whether cancellation is still possible.",
            orderStatus: "Processing",
            expected: "2026-10-19",
            tracking: "Not available",
            notes: [],
            reply: ""
        },
        {
            id: "SR-1036",
            type: "Delayed Order",
            customer: "Ayesha Malik",
            email: "ayesha@example.com",
            order: "ORD-2069",
            status: "Escalated",
            priority: "High",
            created: "2026-10-15",
            summary: "Delivery has exceeded the expected date.",
            detail: "The case requires a human agent to review the delivery information.",
            orderStatus: "Delayed",
            expected: "2026-10-13",
            tracking: "TRK-700269",
            notes: [],
            reply: ""
        },
        {
            id: "SR-1031",
            type: "Order Inquiry",
            customer: "Usman Tariq",
            email: "usman@example.com",
            order: "ORD-2062",
            status: "In Progress",
            priority: "Low",
            created: "2026-10-14",
            summary: "Customer requests an order status update.",
            detail: "Review the available order information before replying.",
            orderStatus: "Processing",
            expected: "2026-10-21",
            tracking: "Not available",
            notes: [],
            reply: ""
        },
        {
            id: "SR-1029",
            type: "Cancellation",
            customer: "Hira Shah",
            email: "hira@example.com",
            order: "ORD-2058",
            status: "Resolved",
            priority: "Medium",
            created: "2026-10-13",
            summary: "Customer requested order cancellation.",
            detail: "This support case has been marked as resolved in the demo.",
            orderStatus: "Processing",
            expected: "2026-10-18",
            tracking: "Not available",
            notes: [],
            reply: ""
        },
        {
            id: "SR-1025",
            type: "Delivery Dispute",
            customer: "Hamza Iqbal",
            email: "hamza@example.com",
            order: "ORD-2051",
            status: "Resolved",
            priority: "Low",
            created: "2026-10-12",
            summary: "Customer asked for clarification about delivery.",
            detail: "The support case has been closed in the demo.",
            orderStatus: "Delivered",
            expected: "2026-10-12",
            tracking: "TRK-700251",
            notes: [],
            reply: ""
        }
    ];

    let cases = initialCases.map(item => ({ ...item, notes: [...item.notes] }));
    let selectedId = cases[0]?.id ?? null;
    let activeView = "dashboard";
    let searchTerm = "";
    let statusFilter = "All";
    let typeFilter = "All";
    let activity = [
        {
            text: "Admin panel initialized",
            detail: "Demo mode is active.",
            time: new Date()
        }
    ];

    const escapeHTML = (value) =>
        String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    const selectedCase = () => cases.find(item => item.id === selectedId);

    function logActivity(text) {
        activity.unshift({
            text,
            detail: selectedId || "Admin panel",
            time: new Date()
        });

        activity = activity.slice(0, 12);
        renderActivity();
    }

    function statusClass(status) {
        const value = status.toLowerCase();

        if (value === "resolved") return "success";
        if (value === "escalated") return "danger";
        if (value === "in progress") return "info";
        if (value === "pending review") return "warning";

        return "muted";
    }

    function badge(status) {
        return `<span class="badge ${statusClass(status)}">${escapeHTML(status)}</span>`;
    }

    function renderStats() {
        const counts = {
            pending: cases.filter(item => item.status === "Pending Review").length,
            progress: cases.filter(item => item.status === "In Progress").length,
            escalated: cases.filter(item => item.status === "Escalated").length,
            resolved: cases.filter(item => item.status === "Resolved").length
        };

        const statValues = $$(".stat-card .stat-value, .stat-card h2, .stat-card h3");

        if (statValues.length >= 4) {
            statValues[0].textContent = counts.pending;
            statValues[1].textContent = counts.progress;
            statValues[2].textContent = counts.escalated;
            statValues[3].textContent = counts.resolved;
        }

        const navCount = $('[data-pending-count]');
        if (navCount) navCount.textContent = counts.pending;

        const pendingLabel = $("#pendingCount");
        if (pendingLabel) pendingLabel.textContent = counts.pending;

        const progressLabel = $("#progressCount");
        if (progressLabel) progressLabel.textContent = counts.progress;

        const escalatedLabel = $("#escalatedCount");
        if (escalatedLabel) escalatedLabel.textContent = counts.escalated;

        const resolvedLabel = $("#resolvedCount");
        if (resolvedLabel) resolvedLabel.textContent = counts.resolved;

        const totalLabel = $("#totalCases");
        if (totalLabel) totalLabel.textContent = cases.length;

        renderAnalytics();
    }

    function filteredCases() {
        return cases.filter(item => {
            const text = [
                item.id,
                item.type,
                item.customer,
                item.order,
                item.status,
                item.summary
            ].join(" ").toLowerCase();

            const matchesSearch = text.includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All" || item.status === statusFilter;
            const matchesType = typeFilter === "All" || item.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }

    function renderCaseList() {
        const container = $("#caseList");
        if (!container) return;

        const items = filteredCases();

        if (!items.length) {
            container.innerHTML = `<p class="empty-state">No matching support cases.</p>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <button type="button"
                class="case ${item.id === selectedId ? "active" : ""}"
                data-case-id="${escapeHTML(item.id)}">
                <div class="caseline">
                    <strong>${escapeHTML(item.id)}</strong>
                    ${badge(item.status)}
                </div>
                <div class="case-sub">
                    ${escapeHTML(item.customer)} · ${escapeHTML(item.order)}
                </div>
                <p>${escapeHTML(item.summary)}</p>
                <div class="caseline">
                    <span class="tag">${escapeHTML(item.type)}</span>
                    <span class="tag">${escapeHTML(item.priority)} priority</span>
                </div>
            </button>
        `).join("");

        container.querySelectorAll("[data-case-id]").forEach(button => {
            button.addEventListener("click", () => {
                selectedId = button.dataset.caseId;
                renderAll();
            });
        });
    }

    
    function renderCaseDetail() {
        const container = $("#caseDetail");
        if (!container) return;

        const item = selectedCase();

        if (!item) {
            container.innerHTML = `<p class="empty-state">Select a support case to view its details.</p>`;
            return;
        }

        container.innerHTML = `
            <div class="panel-header">
                <div>
                    <h3>${escapeHTML(item.id)} — ${escapeHTML(item.type)}</h3>
                    <p>${escapeHTML(item.summary)}</p>
                </div>
                ${badge(item.status)}
            </div>

            <div class="info-grid">
                <div class="info">
                    <span>Customer</span>
                    <strong>${escapeHTML(item.customer)}</strong>
                </div>
                <div class="info">
                    <span>Email</span>
                    <strong>${escapeHTML(item.email)}</strong>
                </div>
                <div class="info">
                    <span>Order</span>
                    <strong>${escapeHTML(item.order)}</strong>
                </div>
                <div class="info">
                    <span>Order status</span>
                    <strong>${escapeHTML(item.orderStatus)}</strong>
                </div>
                <div class="info">
                    <span>Expected delivery</span>
                    <strong>${escapeHTML(item.expected)}</strong>
                </div>
                <div class="info">
                    <span>Tracking reference</span>
                    <strong>${escapeHTML(item.tracking)}</strong>
                </div>
            </div>

            <div class="section">
                <h4>Case description</h4>
                <p>${escapeHTML(item.detail)}</p>
            </div>

            <div class="section">
                <h4>Internal notes</h4>
                <div class="note-list">
                    ${item.notes.length
                        ? item.notes.map(note => `<p class="note">${escapeHTML(note)}</p>`).join("")
                        : `<p class="muted">No internal notes yet.</p>`
                    }
                </div>
                <label for="noteInput">Add an internal note</label>
                <textarea id="noteInput" rows="3" placeholder="Record investigation findings..."></textarea>
                <button type="button" class="btn" id="addNote">Add Note</button>
            </div>

            <div class="section">
                <h4>Customer response draft</h4>
                <textarea id="replyInput" rows="4"
                    placeholder="Write a response for the customer...">${escapeHTML(item.reply)}</textarea>
                <div class="actions">
                    <button type="button" class="btn" id="saveDraft">Save Draft</button>
                    <button type="button" class="btn" id="previewDraft">Preview Draft</button>
                </div>
                <div id="replyPreview" class="reply-preview hidden"></div>
                <p class="muted">Demo mode: drafts are not sent to customers.</p>
            </div>

            <div class="section">
                <h4>Case actions</h4>
                <div class="actions">
                    <button type="button" class="btn" data-action="In Progress">Start Investigation</button>
                    <button type="button" class="btn" data-action="Pending Review">Return to Review</button>
                    <button type="button" class="btn" data-action="Awaiting Customer">Await Customer</button>
                    <button type="button" class="btn" data-action="Escalated">Escalate</button>
                    <button type="button" class="btn" data-action="Resolved">Resolve Case</button>
                    <button type="button" class="btn" data-action="Rejected">Reject Request</button>
                </div>
                <p class="muted">These actions update demo state only. Cancellation and address changes are not performed.</p>
            </div>
        `;

        $("#addNote")?.addEventListener("click", addNote);
        $("#saveDraft")?.addEventListener("click", saveDraft);
        $("#previewDraft")?.addEventListener("click", previewDraft);

        container.querySelectorAll("[data-action]").forEach(button => {
            button.addEventListener("click", () => changeStatus(button.dataset.action));
        });
    }

    function addNote() {
        const item = selectedCase();
        const input = $("#noteInput");
        const note = input?.value.trim();

        if (!item || !note) {
            alert("Select a case and enter a note first.");
            return;
        }

        item.notes.push(note);
        logActivity(`Internal note added to ${item.id}`);
        renderCaseDetail();
    }

    function saveDraft() {
        const item = selectedCase();
        const input = $("#replyInput");

        if (!item || !input) return;

        item.reply = input.value.trim();
        logActivity(`Customer response draft saved for ${item.id}`);

        alert("Draft saved in this browser session. No message was sent.");
    }

    function previewDraft() {
        const item = selectedCase();
        const input = $("#replyInput");
        const preview = $("#replyPreview");

        if (!item || !input || !preview) return;

        item.reply = input.value.trim();
        preview.textContent = item.reply || "The response draft is empty.";
        preview.classList.remove("hidden");
    }

    function changeStatus(newStatus) {
        const item = selectedCase();
        if (!item) return;

        if (["Resolved", "Rejected"].includes(newStatus) && $("#confirmClose")?.checked) {
            const confirmed = confirm(`Confirm changing ${item.id} to "${newStatus}"?`);
            if (!confirmed) return;
        }

        item.status = newStatus;
        logActivity(`${item.id} status changed to ${newStatus}`);
        renderAll();
    }

   function tableBody(selector) {
        const element = $(selector);
        if (!element) return null;

        if (element.tagName === "TBODY") return element;

        let body = element.querySelector("tbody");
        if (!body) {
            body = document.createElement("tbody");
            element.appendChild(body);
        }

        return body;
    }

    function renderQueue() {
        const body = tableBody("#queueTable");
        if (!body) return;

        const items = cases.filter(item =>
            ["Pending Review", "Escalated", "Awaiting Customer"].includes(item.status)
        );

        body.innerHTML = items.length ? items.map(item => `
            <tr>
                <td>${escapeHTML(item.id)}</td>
                <td>${escapeHTML(item.customer)}</td>
                <td>${escapeHTML(item.type)}</td>
                <td>${escapeHTML(item.order)}</td>
                <td>${badge(item.status)}</td>
                <td><button type="button" class="btn table-open" data-open-case="${escapeHTML(item.id)}">Review</button></td>
            </tr>
        `).join("") : `<tr><td colspan="6">No cases in the review queue.</td></tr>`;

        body.querySelectorAll("[data-open-case]").forEach(button => {
            button.addEventListener("click", () => {
                selectedId = button.dataset.openCase;
                showView("dashboard");
                renderAll();
            });
        });
    }

    function renderOrders() {
        const body = tableBody("#ordersTable");
        if (!body) return;

        const uniqueOrders = [...new Map(cases.map(item => [item.order, item])).values()];

        body.innerHTML = uniqueOrders.map(item => `
            <tr>
                <td>${escapeHTML(item.order)}</td>
                <td>${escapeHTML(item.customer)}</td>
                <td>${escapeHTML(item.orderStatus)}</td>
                <td>${escapeHTML(item.expected)}</td>
                <td>${escapeHTML(item.tracking)}</td>
                <td><button type="button" class="btn table-open" data-open-case="${escapeHTML(item.id)}">View Case</button></td>
            </tr>
        `).join("");

        bindOpenCaseButtons(body);
    }

    function renderCustomers() {
        const body = tableBody("#customersTable");
        if (!body) return;

        const uniqueCustomers = [...new Map(cases.map(item => [item.email, item])).values()];

        body.innerHTML = uniqueCustomers.map(item => `
            <tr>
                <td>${escapeHTML(item.customer)}</td>
                <td>${escapeHTML(item.email)}</td>
                <td>${escapeHTML(item.order)}</td>
                <td>${escapeHTML(item.id)}</td>
                <td>${badge(item.status)}</td>
            </tr>
        `).join("");
    }

    function renderSupport() {
        const body = tableBody("#supportTable");
        if (!body) return;

        body.innerHTML = cases.map(item => `
            <tr>
                <td>${escapeHTML(item.id)}</td>
                <td>${escapeHTML(item.type)}</td>
                <td>${escapeHTML(item.customer)}</td>
                <td>${escapeHTML(item.priority)}</td>
                <td>${badge(item.status)}</td>
                <td><button type="button" class="btn table-open" data-open-case="${escapeHTML(item.id)}">Manage</button></td>
            </tr>
        `).join("");

        bindOpenCaseButtons(body);
    }

    function bindOpenCaseButtons(container) {
        container.querySelectorAll("[data-open-case]").forEach(button => {
            button.addEventListener("click", () => {
                selectedId = button.dataset.openCase;
                showView("dashboard");
                renderAll();
            });
        });
    }

    function renderAnalytics() {
        const container = $("#typeAnalytics");
        if (!container) return;

        const types = [...new Set(cases.map(item => item.type))];

        container.innerHTML = types.map(type => {
            const count = cases.filter(item => item.type === type).length;
            const percent = cases.length ? Math.round(count / cases.length * 100) : 0;

            return `
                <div class="analytics-row">
                    <div class="caseline">
                        <span>${escapeHTML(type)}</span>
                        <strong>${count}</strong>
                    </div>
                    <div class="analytics-track">
                        <div class="analytics-bar" style="width:${percent}%"></div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function renderActivity() {
        const container = $("#activityList");
        if (!container) return;

        container.innerHTML = activity.map(item => `
            <div class="activity-row">
                <div>
                    <strong>${escapeHTML(item.text)}</strong>
                    <p>${escapeHTML(item.detail)}</p>
                </div>
                <span class="muted">${escapeHTML(item.time.toLocaleTimeString())}</span>
            </div>
        `).join("");
    }

    function showView(view) {
        activeView = view;

        $$(".view").forEach(element => {
            element.classList.toggle("hidden", element.id !== view);
        });

        $$("[data-view]").forEach(link => {
            link.classList.toggle("active", link.dataset.view === view);
        });

        const title = $("#pageTitle");
        if (title) {
            title.textContent = ({
                dashboard: "Dashboard",
                queue: "Review Queue",
                orders: "Orders",
                customers: "Customers",
                support: "Support Requests",
                analytics: "Analytics",
                settings: "Settings"
            })[view] || "Admin Panel";
        }
    }

    function renderAll() {
        renderStats();
        renderCaseList();
        renderCaseDetail();
        renderQueue();
        renderOrders();
        renderCustomers();
        renderSupport();
        renderActivity();
    }

    $$("[data-view]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            showView(link.dataset.view);
        });
    });

    $$("[data-goto]").forEach(button => {
        button.addEventListener("click", () => showView(button.dataset.goto));
    });

    $("#globalSearch")?.addEventListener("input", event => {
        searchTerm = event.target.value;
        renderCaseList();
    });

    $("#globalSearch")?.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;

        const match = cases.find(item => [
            item.id,
            item.customer,
            item.order,
            item.type
        ].join(" ").toLowerCase().includes(searchTerm.toLowerCase()));

        if (match) {
            selectedId = match.id;
            showView("dashboard");
            renderAll();
        } else {
            showView("queue");
            renderQueue();
        }
    });

    $("#statusFilter")?.addEventListener("change", event => {
        statusFilter = event.target.value;
        renderCaseList();
    });

    $("#typeFilter")?.addEventListener("change", event => {
        typeFilter = event.target.value;
        renderCaseList();
    });

    $("#showWarning")?.addEventListener("change", event => {
        const notice = $("#demoNotice");
        if (notice) notice.classList.toggle("hidden", !event.target.checked);
    });

    $("#saveSettings")?.addEventListener("click", () => {
        const name = $("#nameInput")?.value.trim() || "Support Admin";
        const message = $("#settingsMessage");

        const profileName = $(".staff-profile .profile-name");
        if (profileName) profileName.textContent = name;

        if (message) message.textContent = "Settings updated for this session.";
        logActivity("Admin settings updated");
    });

    showView("dashboard");
    renderAll();
});
