App = {
  printPage: function() {
    var printContents = document.getElementById('printable').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;

    window.print();
    document.body.innerHTML = originalContents;
  }
}

$(document).ready(function() {
  $("#printPage").click(function(e) {
    e.preventDefault();
    App.printPage();
  })
});
