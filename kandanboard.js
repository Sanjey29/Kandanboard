// JavaScript for Sticky Notes Board - Modernized & Bug-Checked

const plus = document.querySelector(".add");
const notes = document.querySelector(".window");
let flag = true;
let ticket_color_selector = "green";
let tickets = localStorage.getItem("Ticket") ? JSON.parse(localStorage.getItem("Ticket")) : [];

plus.addEventListener('click', () => {
    flag = !flag;
    plus.style.color = flag ? "black" : "blue";
    notes.style.display = flag ? "none" : "flex";
});

const body1 = document.querySelector(".stick");
const textarea1 = document.querySelector("#textarea");

function new_notes(ticket_color, user_text, taskid, yesadd) {
    const ticket = document.createElement("div");
    ticket.className = "note1";
    ticket.innerHTML = `
        <div class="notes">
            <div class="pad">
                <div class="ncolor" style="background-color: ${ticket_color};"></div>
                <div class="no">TaskId - ${taskid}</div>
                <div class="text" contenteditable="false">${user_text}</div>
                <div class="lock">
                    <i class="fa-solid fa-lock"></i>
                </div>
            </div>
        </div>`;

    removal(ticket, taskid);
    handlelock(ticket, taskid);
    handleColor(ticket, taskid);
    body1.appendChild(ticket);

    if (yesadd) {
        tickets.push({ ticket_color, user_text, taskid });
        localStorage.setItem("Ticket", JSON.stringify(tickets));
    }
}

if (tickets.length) {
    tickets.forEach(t => new_notes(t.ticket_color, t.user_text, t.taskid, false));
}

notes.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && textarea1.value.trim()) {
        const user_input = textarea1.value.trim();
        const taskid = shortid();
        new_notes(ticket_color_selector, user_input, taskid, true);
        textarea1.value = "";
        notes.style.display = "none";
        plus.style.color = "black";
        flag = true;
    }
});

const allcolor = document.querySelectorAll(".color");

allcolor.forEach((colorElement) => {
    colorElement.addEventListener("click", () => {
        allcolor.forEach(c => {
            c.classList.remove("active");
            c.style.borderColor = 'transparent';
        });

        colorElement.classList.add("active");
        colorElement.style.borderColor = 'blue';
        ticket_color_selector = colorElement.classList[0];
    });
});

const delbut = document.querySelector(".remove-btn");
let flag1 = true;

delbut.addEventListener("click", () => {
    flag1 = !flag1;
    alert(`Delete mode ${flag1 ? "deactivated" : "activated"} !`);
    delbut.classList.toggle("active");
});

function removal(ticket, taskid) {
    ticket.addEventListener('click', () => {
        if (!flag1) {
            ticket.remove();
            tickets = tickets.filter(t => t.taskid !== taskid);
            localStorage.setItem("Ticket", JSON.stringify(tickets));
        }
    });
}

function handlelock(ticket, taskid) {
    const lock = ticket.querySelector(".lock i");
    const textElem = ticket.querySelector(".text");

    lock.addEventListener("click", () => {
        const isLocked = lock.classList.contains("fa-lock");
        lock.classList.toggle("fa-lock", !isLocked);
        lock.classList.toggle("fa-lock-open", isLocked);
        textElem.contentEditable = isLocked;

        if (!isLocked) {
            const updatedText = textElem.innerText.trim();
            const sel_ticket = tickets.find(t => t.taskid === taskid);
            if (sel_ticket) {
                sel_ticket.user_text = updatedText;
                localStorage.setItem("Ticket", JSON.stringify(tickets));
            }
        }
    });
}

const colorList = ["rgb(39, 174, 96)", "rgb(231, 76, 60)", "rgb(241, 196, 15)", "rgb(52, 73, 94)"];

function handleColor(ticket, taskid) {
    const sel_col = ticket.querySelector(".ncolor");

    sel_col.addEventListener('click', () => {
        const currentColor = getComputedStyle(sel_col).backgroundColor;
        let index = colorList.findIndex(color => color === currentColor);
        let newIndex = (index + 1) % colorList.length;
        const newColor = colorList[newIndex];

        sel_col.style.backgroundColor = newColor;

        const sel_ticket = tickets.find(t => t.taskid === taskid);
        if (sel_ticket) {
            sel_ticket.ticket_color = newColor;
            localStorage.setItem("Ticket", JSON.stringify(tickets));
        }
    });
}

// Color Filtering
const Allcolors = document.querySelectorAll(".function .color");

Allcolors.forEach(e => {
    e.addEventListener('click', function () {
        let sel_color = getComputedStyle(e).backgroundColor;
        const db = tickets.filter(t => t.ticket_color === sel_color);
        body1.innerHTML = "";
        db.forEach(t => new_notes(t.ticket_color, t.user_text, t.taskid, false));
    });

    e.addEventListener('dblclick', () => {
        body1.innerHTML = "";
        tickets.forEach(t => new_notes(t.ticket_color, t.user_text, t.taskid, false));
    });
});
