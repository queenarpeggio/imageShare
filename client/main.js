import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';
import '../lib/collection.js';

Session.set('imgLimit', 3);


lastScrollTop = 0;
$(window).scroll(function(event){
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		var scrollTop = $(this).scrollTop();
			if (scrollTop > lastScrollTop){
				Session.set('imgLimit', Session.get('imgLimit') + 3);
			}
			lastScrollTop = scrollTop;
		}
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY',
});

Template.mainBody.helpers({
	imagesFound(){
		return imagesDB.find().count();
	},
	imageAge(){
		var imgCreatedOn = imagesDB.findOne({_id:this._id}).createdOn;
		imgCreatedOn = Math.round((new Date() - imgCreatedOn)/60000);
		return imgCreatedOn;

	}, 
	imgAll(){
		var prevTime = new Date() - 15000;
		var newResults = imagesDB.find({"createdOn":{$gte:prevTime}}).count();
		if(newResults > 0){
			return imagesDB.find({}, {sort:{createdOn: - 1, imgRate: - 1}, limit:Session.get('imgLimit')});
		}else{
			return imagesDB.find({}, {sort:{imgRate: - 1}, limit:Session.get('imgLimit')});
		}
		
	},
	userLoggedIn(){
		if(Meteor.user()){
				return true;
		}else{
			return false;
		}
	}
})

Template.myJumbo.events({
	'click .js-addimgs'(event){
		$("#addimgModal").modal("show");
	}
});

Template.addimgs.events({
	'click .js-saveImgs'(event){
		var imgPath = $("#imgPath").val();
		var imgTitle = $("#imgTitle").val();
		var imgDesc = $("#imgDesc").val();
			console.log("save", imgTitle, imgDesc, imgPath);
				$("#addimgModal").modal("hide");
		imagesDB.insert({"title":imgTitle, "path":imgPath, "description":imgDesc, "createdOn": new Date().getTime()});
	},
	'click .js-cancelAdd'(){
		$("#imgTitle").val('');
		$("#imgPath").val('');
		$("#imgDesc").val('');
		$("#addImgPreview").attr('src');
		$("#addImgModal").modal("hide");
	},
	'input #imgPath'(event){
		var imgPath = $("#imgPath").val();
		$("#addImgPreview").attr('src', imgPath);
	},

	'change #imgPath'(event){
		var imgPath = $("#imgPath").val();
		$("#addimgspreview").attr('src', imgPath);
	}
});

Template.mainBody.events({
	'click .js-delete'(){
		var imgId = this._id;
		$("#"+imgId).fadeOut('slow', function(){
			imagesDB.remove({_id:imgId});

		});

	},
	'click .js-edit'(event, instance){
		var imgId = this._id;
		$('#ImgPreview').attr('src',imagesDB.findOne({_id:imgId}).path);
		$("#eimgTitle").val(imagesDB.findOne({_id:imgId}).title);
		$("#eimgPath").val(imagesDB.findOne({_id:imgId}).path);
		$("eimgDesc").val(imagesDB.findOne({_id:imgId}).description);
		$('editModal').modal("show");
	},
	'click .js-rate'(event){
		var imgId = this.data_id;
		var rating = $(event.currentTarget).data('userrating');
		console.log("You clicked a star", imgId, "with a rating of", rating);
		imagesDB.update({_id:imgId}, {$set:{'imgRate':rating}}); 
	}
});

Template.editImg.events({
	'click .js-updateImg'(){
		var eId = $('#eId').val();
		var imgTitle = $("#eimgTitle").val();
		var imgPath = $("#eimgPath").val();
		var imgDesc = $("#eimgDesc").val();
		imagesDB.update({_id:eId}, {$set:{"title":imgTitle, "path":imgPath, "desc":imgDesc}});
		$('#editImgModal').modal("hide");
	}
});
