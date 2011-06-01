/**
 * jQuery promptSave
 * By: Matthew Toledo [http://www.matthewtoledo.com]
 * Version 1.0.0
 * Last Modified: 6/1/2011
 * 
 * Attach this widget to a form elements.  Does't make much sense to attach it
 * to anything else.
 * 
 * It scans all the elements in the form to see if they have changed since the
 * widget was initialized.  If there were changes, this prompts you to ask if 
 * you want to save your changes before the page unloads. 
 * 
 * Elements with that match exemptClass will not be monitored for changes.
 * 
 * If the user clicks on any submit button, we do not monitor for changes since
 * they are most likely saving the data. 
 * 
 */
(function($, undefined) {
	$.widget("ui.promptSave" , {
		_create		:	function() {

							// Save the initial values for each input item. This data is used to 
							// prompt user to save page before leaving if the data has changed.
							$(this.element).find(':input').each(function() {
								if (false == $(this).hasClass('noprompt')) {
									$(this).data('initialValue', $(this).val());
								}
							});

							// initialize submit button events
							this._submit();

							// initialize what window onbeforeunload event
							this._unload();


		},
		_prompt		:	true,
		_unload		: 	function () {

							var prompt = this.getPrompt();
							var element = this.element;
							var msg	= this.message;

							$(window).bind('beforeunload.promptsave',function(e){

								if (true == prompt) {
									var isDirty = false;
									$(element).find(':input').each(function () {
										if (false == $(this).hasClass('noprompt')) {
											if($(this).data('initialValue') != $(this).val()){
												isDirty = true;
											}
										}
									});
									if(isDirty == true){
										return msg;
									}
								} 					
							})
						},
		_submit		: 	function () { 
							$(this.element).bind('submit.promptsave', function(e) {
								var btn = $(e.target);
								if ($(btn).hasClass(exemptClass)) {
									this.setPrompt(false);
								}
							})
						},
		getPrompt	:	function () {return this._prompt;},
		setPrompt	:	function (b) {this._prompt = b;},
		destroy		:	function () {
							// unbind all events
							$(this.element).unbind('submit.promptsave');
							$(window).unbind('beforeunload.promptsave');

							// remove all data that we added to track clean / dirty
							$(this.element).find(':input').each(function () {
								$(this).removeData('initialValue')
							});

							// reset widget defaults
							this.exemptClass = 'noprompt';
							this._prompt = true;

						},
		exemptClass :	'noprompt',
		message		:   "Did you want to cancel without saving?"
	});
})(jQuery);
