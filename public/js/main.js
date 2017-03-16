var app = null
$("form").submit(function(e) {
  e.preventDefault()
  var name = $("input[type='text']").val()

   app = new AppRoom()
   app.user = new userSocket(name)

   // DEMO PURPOOSE - FORCE ROOM TO APPEAR
   app.joinRoom('presentation')

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    render()
})
