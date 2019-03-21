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
		imagesDB.insert({"title":imgTitle, "path":imgPath, "description":imgDesc})
	},
	'change #imgPath'(event){
		var imgPath = $("#imgPath").val();
		$("#addimgspreview").attr('src', imgPath);
	}
});