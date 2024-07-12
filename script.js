document.addEventListener("DOMContentLoaded", function() {
    if (typeof emailjsConfig !== 'undefined') {
        emailjs.init(emailjsConfig.userId);
    } else {
        console.error("emailjsConfig is not defined");
    }
    loadContent('feed'); // Carga inicial de la sección "feed"
});

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function sendEmail(event) {
    event.preventDefault();

    var userEmail = escapeHtml(document.getElementById("email").value);

    var templateParams = {
        to_email: userEmail,
        from_name: "Krishna Sandoval",
        message: "Muchas gracias por el apoyo. Si te gusta mi trabajo, puedes contactarme."
    };

    emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, templateParams)
        .then(function(response) {
            document.getElementById("confirmationMessage").innerText = "Email sent successfully!";
            document.getElementById("confirmationMessage").style.display = "block";
            document.getElementById("email").value = "";
        }, function(error) {
            document.getElementById("confirmationMessage").innerText = "Failed to send email. Please try again later.";
            document.getElementById("confirmationMessage").style.display = "block";
        });

    var notificationParams = {
        to_email: "jikjfeippk123@gmail.com",
        from_email: userEmail
    };

    emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, notificationParams)
        .then(function(response) {
            // Success handling for notification
        }, function(error) {
            // Error handling for notification
        });
}

function setActive(event, section) {
    event.preventDefault();

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    event.target.closest('.nav-item').classList.add('active');

    loadContent(section);
}

function loadContent(section) {
    const contentContainer = document.getElementById('content-container');
    const oldLink = document.getElementById('section-css');
    if (oldLink) {
        oldLink.remove();
    }
    const link = document.createElement('link');
    link.id = 'section-css';
    link.rel = 'stylesheet';
    link.href = `${encodeURIComponent(section)}.css?v=${new Date().getTime()}`;
    document.head.appendChild(link);

    fetch(`${encodeURIComponent(section)}.html?v=${new Date().getTime()}`)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            while (contentContainer.firstChild) {
                contentContainer.removeChild(contentContainer.firstChild);
            }
            Array.from(doc.body.childNodes).forEach(node => {
                contentContainer.appendChild(node);
            });
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById("confirmationMessage").innerText = "An error occurred. Please try again later.";
            document.getElementById("confirmationMessage").style.display = "block";
        });
}















