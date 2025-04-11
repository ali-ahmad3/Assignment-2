$(document).ready(function () {
    // Navbar Scroll Effect
    const $navbar = $('#mainNav');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 50) {
            $navbar.addClass('scrolled');
        } else {
            $navbar.removeClass('scrolled');
        }
    });

    // Smooth Scrolling
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 'smooth');
        }
    });

    // Form Validation
    $('.needs-validation').on('submit', function (e) {
        const $form = $(this);
        if (!$form[0].checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault();
            showNotification('Success!', 'Form submitted successfully.');
            $form[0].reset();
        }
        $form.addClass('was-validated');
    });

    // Chat Widget
    const $chatWidget = $('#chatWidget');
    const $chatToggle = $('.chat-toggle');
    const $chatInput = $('.chat-input input');
    const $sendMessage = $('.send-message');
    const $chatMessages = $('.chat-messages');

    // Toggle chat widget
    $chatToggle.on('click', function () {
        $chatWidget.toggleClass('active');
    });

    // Send message
    function sendChatMessage() {
        const message = $chatInput.val().trim();
        if (message) {
            // Add user message
            $chatMessages.append(`<div class="message user">${message}</div>`);

            // Clear input
            $chatInput.val('');

            // Simulate response (replace with actual chat functionality)
            setTimeout(() => {
                $chatMessages.append('<div class="message support">Thank you for your message. Our team will respond shortly.</div>');
                $chatMessages.scrollTop($chatMessages[0].scrollHeight);
            }, 1000);
        }
    }

    $sendMessage.on('click', sendChatMessage);
    $chatInput.on('keypress', function (e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    // Show chat widget after 3 seconds
    setTimeout(() => {
        $chatWidget.addClass('active');
    }, 3000);

    // Notification System
    function showNotification(title, message) {
        const $notification = $(`
            <div class="notification">
                <div class="notification-content">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
        `);
        $('body').append($notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            $notification.remove();
        }, 3000);
    }

    // Login Form Handling
    const $loginForm = $('#loginForm');
    if ($loginForm.length) {
        $loginForm.on('submit', function (e) {
            e.preventDefault();
            showNotification('Success', 'Login successful!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
        });
    }

    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Protected Content
    $('.protected-content').each(function () {
        if (!checkAuth()) {
            $(this).html(`
                <div class="text-center p-4">
                    <h3>Protected Content</h3>
                    <p>Please login to view this content</p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                        Login to View
                    </button>
                </div>
            `);
        }
    });
    // Fetch and render pricing plans using XHR
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'js/pricing.json', true);
    xhr.responseType = 'text'; // We'll parse JSON manually

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const data = JSON.parse(xhr.responseText);
                const pricingContainer = document.querySelector('#pricing .row');
                if (!pricingContainer) {
                    console.error('Pricing container not found. Ensure section has id="pricing".');
                    return;
                }
                if (!data.pricingPlans || !Array.isArray(data.pricingPlans)) {
                    console.error('Invalid pricing data format.');
                    pricingContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-danger">Invalid pricing data. Please try again later.</p>
                    </div>
                `;
                    return;
                }
                data.pricingPlans.forEach(function (plan) {
                    const cardHtml = `
                    <div class="col-md-4">
                        <div class="card pricing-card h-100">
                            <div class="card-body text-center">
                                <h3 class="card-title">${plan.title}</h3>
                                <h4 class="card-price">${plan.price}</h4>
                                <ul class="list-unstyled">
                                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                                <button class="btn btn-primary">${plan.buttonText}</button>
                            </div>
                        </div>
                    </div>
                `;
                    pricingContainer.insertAdjacentHTML('beforeend', cardHtml);
                });
            } catch (e) {
                console.error('Error parsing JSON:', e);
                const pricingContainer = document.querySelector('#pricing .row');
                pricingContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-danger">Failed to parse pricing data. Please try again later.</p>
                </div>
            `;
            }
        } else {
            console.error('Error loading pricing data: Status', xhr.status, xhr.statusText);
            const pricingContainer = document.querySelector('#pricing .row');
            pricingContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Failed to load pricing plans (Status: ${xhr.status}). Please try again later.</p>
            </div>
        `;
        }
    };

    xhr.onerror = function () {
        console.error('Error loading pricing data: Network error');
        const pricingContainer = document.querySelector('#pricing .row');
        pricingContainer.innerHTML = `
        <div class="col-12 text-center">
            <p class="text-danger">Failed to load pricing plans due to a network error. Please try again later.</p>
        </div>
    `;
    };

    xhr.send();
});