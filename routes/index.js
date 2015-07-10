var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: 'Arti'});
});

// GET demo home page
router.get('/demo', function(req, res, next){
  res.render('demo_index', { });
});

router.get('/whats-new', function(req, res, next){
  res.render('whats_new', { });
});

module.exports = router;



<script type="text/javascript">
  var _bcvma = _bcvma || [];
  _bcvma.push(["setAccountID", "391752780525725401"]);
  _bcvma.push(["setParameter", "InvitationDefID", "387983771153311821"]);
  _bcvma.push(["addFloat", {type: "chat", id: "387983770890712685"}]);
  _bcvma.push(["pageViewed"]);
  (function(){
    var vms = document.createElement("script"); vms.type = "text/javascript"; vms.async = true;
    vms.src = ('https:'==document.location.protocol?'https://':'http://') + "vmss.boldchat.com/aid/391752780525725401/bc.vms4/vms.js";
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(vms, s);
  })();
</script>
<noscript>
<a href="http://www.boldchat.com" title="Live Support" target="_blank"><img alt="Live Support" src="https://vms.boldchat.com/aid/391752780525725401/bc.vmi?" border="0" width="1" height="1" /></a>
</noscript>
