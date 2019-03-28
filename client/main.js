import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collection.js';

Template.mainBody.helpers({
	imgAll(){
		return imagesDB.find({});
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
		imagesDB.insert({"title":imgTitle, "path":imgPath, "description":imgDesc, "createdOn":Date()});
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