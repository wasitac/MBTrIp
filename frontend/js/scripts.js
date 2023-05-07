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



// MBTI 클릭 효과와 값 받아오기
function getMbtiValue(img) {
    const mbtiElements = document.querySelectorAll(".mbti");
    for (const mbtiElement of mbtiElements) {
      mbtiElement.classList.remove("active");
    }
    const mbtiDiv = img.parentNode;
    if (!mbtiDiv.classList.contains("active")) {
        mbtiDiv.classList.add("active");
    }
    var mbtiValue = img.alt;
    var mbtiValueElement = document.getElementById("mbti-value");
    mbtiValueElement.innerHTML = mbtiValue;
  }


let myInfo = '';
async function start(){
    const mbti = document.getElementById('mbti-value').innerText;
    const depart = document.getElementById('depart').value;
    const arrive = document.getElementById('arrive').value;
    const move = document.getElementById('move').value;

    if (mbti === '당신의 MBTI는?') {
        alert('MBTI를 선택해주세요.');
        return;
    }
    if (depart === '') {
        alert('출발하는 날짜를 알려주세요.');
        return;
    }
    if (arrive === '') {
        alert('돌아오는 날짜를 알려주세요.');
        return;
    }

    myDate = depart+ " 에 출발해서  " + arrive + " 까지";
    document.getElementById("chat").style.display="block";
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
        mbti: mbti,
        myDate: myDate,
        move: move,
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
