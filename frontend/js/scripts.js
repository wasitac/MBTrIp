/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});



async function getTripinfo(){
    try {
        const response = await fetch('http://localhost:3000/trip', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ name: 'john'})
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}


// chating
const chatForm = document.querySelector('.chat-window');
const chatInput = document.querySelector('.chat-window-message');
const chatThread = document.querySelector('.chat-thread');
let userMessage = [];
let assistantMessage = [];

chatForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // 폼이 제출되는 것을 막음

  const message = chatInput.value;
  chatInput.value = ''; // 입력 필드를 비움

  const messageItem = document.createElement('li');
  messageItem.textContent = message;
  chatThread.appendChild(messageItem); // 사용자 입력 메시지를 먼저 채팅창에 추가
  userMessage.push(message);
  try {
    const response = await fetch('http://localhost:3000/trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        userMessage: userMessage,
        assistantMessage: assistantMessage,
     })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    assistantMessage.push(data.assistant);
    
    const responseItem = document.createElement('li');
    responseItem.textContent = data.assistant;
    chatThread.appendChild(responseItem); // API 응답 데이터를 채팅창에 추가
  } catch (error) {
    console.error(error);
  }
});