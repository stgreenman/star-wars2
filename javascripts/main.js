  function decrease(){
    location.href='/students/<%= currentPage-- %>';
  }

  function increase(){
    location.href='/students/<%= currentPage++ %>';
  }
