var app = null
if(window.location.hostname == 'localhost') {
  $("input[type='text']").val('Ivan')
  submitForm()
}
$("form").submit(function(e) {
  e.preventDefault()
  submitForm()
})

function submitForm() {
  var name = $("input[type='text']").val()

  if(name.length > 10) {
    $(".errors").html("10 letters maximum.")
    return false
  }

  if(name.length <= 2) {
    $(".errors").html("You can do better.")
    return false
  }


  app = new AppRoom()
  app.user = new userSocket(name)

  // DEMO PURPOOSE - FORCE ROOM TO APPEAR
  app.joinRoom('presentation')

  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
  render()
}
