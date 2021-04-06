document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {
        menuWidth     : 200,
        edge          : 'right',
        closeOnClick  : true,
        draggable     : true,
    });
  });


  // 