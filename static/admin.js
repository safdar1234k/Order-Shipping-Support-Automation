
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
