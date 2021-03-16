import { SHA256 } from '../utils.js'

function UserLogin({ $changeUser, onLogin, onAutoConfig }) {
  const $modal = document.querySelector('.modal');
  const $close = document.querySelector('.close');

  $changeUser.addEventListener('click', (e) => {
    $modal.style.display = "block";
  })
  // 로그인 절차 없이는 창을 못 끄게 막아둠
  // $close.addEventListener('click', (e) => {
  //   $modal.style.display = "none";
  // })
  // Modal 밖을 누르면 Modal 닫기
  // window.onclick = function (event) {
  //   if (event.target === modal) {
  //     modal.style.display = "none";
  //   }
  // }

  const $createUser = document.querySelector('.login-create');
  $createUser.addEventListener('click', (e) => {
    e.preventDefault()
    const username = $input.value
    const password = $pword.value
    if (username === "") {
      alert("유저 이름이 필요합니다!")
      throw Error
    }
    if (localStorage.getItem(username)) {
      alert("동일한 이름의 유저가 존재합니다!")
      throw Error
    } else {
      const newAppData = JSON.stringify({
        state: {
          user: username,
          pass: SHA256(password),
          currentTableId: 0,
          tables: ['ToDo']
        },
        data: [],
      })
      localStorage.setItem(username, newAppData)
      alert("유저 생성 완료!")
      $input.value = ''
      $pword.value = ''
    }
  })

  const $form = document.querySelector('#login-form');
  const $input = document.querySelector('#login-id');
  const $pword = document.querySelector('#login-pw');
  const $autoCheckBox = document.querySelector('#login-auto');
  $form.addEventListener('submit', (e) => {
    const username = $input.value
    const password = $pword.value
    e.preventDefault()
    try {
      if (!localStorage.getItem(username)) {
        alert('입력하신 유저가 존재하지 않습니다.')
        throw Error
      } else {
        const appData = JSON.parse(window.localStorage.getItem(username))
        if (appData.state.pass === SHA256(password)) {
          onLogin(username)
          $modal.style.display = "none";
          $input.value = ''
          $pword.value = ''
          // input checkbox의 체크 여부 활용
          if ($autoCheckBox.checked) {
            onAutoConfig(username)
          } else {
            onAutoConfig('')
          }
        } else {
          alert('사용자 정보가 불일치 합니다!')
          throw Error
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}

export default UserLogin