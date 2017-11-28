let $ = require('jquery');
require('../css/a.css');
require('../css/aa.less');
require('../css/login.css');
var login = function(){
    var that = this;
    $.ajax({
        type: 'get',
        url:"/?Action=Login",
        data:this.submitObj,
        success: function(result){
            
        }
    });
}
$(function(){
	console.log($('.card'));
});
