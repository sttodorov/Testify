$(document).ready(function() {
	function deleteQuestion(event)
	{
		if($('div.panel.panel-primary').length > 1){
			$('#question-' + event.data.questionId).remove();
		}
	}
	function addOption(event)
	{
		var selectedQuestion = $('#question-'+ event.data.questionId),
			latestInput = selectedQuestion.find('input[type="text"]').last(),
			latestRadio = selectedQuestion.find('input[type="radio"]').last(),
			newOption = latestInput.clone(),
			newRadio = latestRadio.clone(),
			latestItnputSplitted = latestInput.attr('id').split('-'),
			index = +latestItnputSplitted[latestItnputSplitted.length-1]+1;

		newOption.attr('id','option-' + index);
		newOption.attr('placeholder', 'Option ' + index);

		newRadio.attr('value',+ index);

		newOption.insertAfter(latestInput);
		$('<br>').insertBefore(newOption);
		newRadio.insertBefore(newOption);
	}
	function deleteOption(event)
	{
		var selectedQuestion = $('#question-'+ event.data.questionId),
			options = selectedQuestion.find('div.panel-body input[type="text"]'),
			brs = selectedQuestion.find('br');
			if(options.length > 1){
				options.last().remove();
				selectedQuestion.find('div.panel-body input[type="radio"]').last().remove();
				brs.last().remove();
			}
	}

	$("#add-question").on('click', function addQuestion()
	{
		var questions = $('div.panel.panel-primary'),
			newQuestion = questions.last().clone(),
			latestIdSplitted = newQuestion.attr('id').split('-'),
			newQuestionId = +latestIdSplitted[latestIdSplitted.length-1] + 1;

		newQuestion.attr('id','question-'+ newQuestionId);
		newQuestion.find('input.title').attr('id', 'title-question-'+ newQuestionId);
		newQuestion.find('input.title').attr('name', 'title-question-'+ newQuestionId);
		newQuestion.find('input.title').attr('placeholder', 'Question '+ ((+questions.length) + 1));

		newQuestion.find('div.panel-body > input[type="radio"]').each(function(i, el){
			el.setAttribute("name","correct-question-"+newQuestionId);
		});
		newQuestion.find('div.panel-body > input[type="text"]').each(function(i, el){
			el.setAttribute("name","option-question-"+newQuestionId);
		});

		var newQuestionAddOption = newQuestion.find('.btn.btn-success');
		newQuestionAddOption.attr('id', 'add-option-' + newQuestionId);
		newQuestionAddOption.click({questionId: newQuestionId}, addOption);

		var newQuestionDeleteOption = newQuestion.find('.btn.btn-warning');
		newQuestionDeleteOption.attr('id', 'delete-opiton-' + newQuestionId);
		newQuestionDeleteOption.click({questionId: newQuestionId},deleteOption)

		var newDeleteQuestion = newQuestion.find('.btn.btn-danger');
		newDeleteQuestion.attr('id', 'delete-question-' + newQuestionId);
		newDeleteQuestion.click({questionId: newQuestionId},deleteQuestion);

		newQuestion.insertBefore($("#add-question"));
	});

	$('#delete-question-1').click({questionId: 1}, deleteQuestion );
	$('#add-option-1').click({questionId:1},addOption);
	$('#delete-option-1').click({questionId:1},deleteOption);
});