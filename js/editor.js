// buttons to open modal
var css_button = document.querySelector('#css');
var md_button = document.querySelector('#text');
// custom css <style> element
var customstyles = document.querySelector('#customstyles');

// editors
var css_editor = document.querySelector('#css-editor');
var md_editor = document.querySelector('#md-editor');
// textareas
var css_editing_element = document.querySelector("#editing-css");
var md_editing_element = document.querySelector("#editing-md");
var textareas = document.querySelectorAll('textarea');

// editor mode 
var editor_mode = false;

// md converter
var converter = new showdown.Converter({
  simpleLineBreaks:true
})





// Local storage
var hasStorage = (function(){try{localStorage.setItem("mod","mod");localStorage.removeItem("mod");return true;}catch(exception){return false;}}());
if(hasStorage){
  var stored_md = localStorage.getItem("md");
  var stored_css = localStorage.getItem("css");
  var stored_img = localStorage.getItem("img");
  if(stored_md){
    md_editing_element.value = stored_md;
    doAction('apply-md');
  }
  if(stored_css){
    css_editing_element.value = stored_css;
    console.log(stored_css);
    doAction('apply-css');
  }
  if(stored_img){
    var img = document.querySelector('img');
    img.src = stored_img;
  }
}

// Common events for textareas
textareas.forEach(t => {
  t.oninput = (e) => {
    update(t, t.value);
    sync_scroll(t);
  };
  t.onscroll = (e) => {
    sync_scroll(t);
  };
  t.onkeydown = (e) => {
    check_tab(t, e);
  };
});

// Update <code> element according textarea content
function update(element, text) {    
  // Handle final newlines (see https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/)
  if(text[text.length-1] == "\n") {
    text += " ";
  }
  // target
  var result_element_content = document.querySelector('#' + element.dataset.target + "-content");
  // Update code
  result_element_content.innerHTML = text
    .replace(new RegExp("&", "g"), "&amp;")
    .replace(new RegExp("<", "g"), "&lt;")
    .replace(new RegExp(">", "g"), "&gt;");
  // Syntax Highlight
  Prism.highlightElement(result_element_content);
}

// Sync <pre> and <textarea> scroll
function sync_scroll(element) {  
  var result_element = document.querySelector('#' + element.dataset.target );
  // Get and set x and y
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}

// tab behavior like a real IDE
function check_tab(element, event) {
  let code = element.value;
  if(event.key == "Tab") {
    /* Tab key pressed */
    event.preventDefault(); // stop normal
    let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    element.value = before_tab + "\t" + after_tab; // add tab char
    // move cursor
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element, element.value); // Update text to include indent
  } 
}

// Open CSS editor
function openCssEditor(){
  editor_mode = "css";
  css_editing_element.textContent = customstyles.textContent;
  update(css_editing_element, customstyles.textContent);
  css_editor.classList.toggle('visible');
  css_editing_element.focus();
}
css_button.addEventListener('click', openCssEditor);

// Open MD editor
function openMdEditor(){
  editor_mode = "md";
  var text = document.querySelector('article').innerHTML;
  html = converter.makeMd(text);
  md_editing_element.innerHTML = html;
  update(md_editing_element, html);
  md_editor.classList.toggle('visible');
  md_editing_element.focus();
}
md_button.addEventListener('click', openMdEditor);


// Apply & cancel actions
var editor_buttons = document.querySelectorAll('.editor button');
// with buttons
editor_buttons.forEach(button => {
  button.addEventListener('click', function(){
    doAction(button.dataset.action);    
  })
});
// with keys
Mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
  e.preventDefault();
  if(editor_mode == "css") { doAction("apply-css"); }
  if(editor_mode == "md") { doAction("apply-md"); }
  return false;
});
Mousetrap.bind(['esc', 'escape'], function(e) {
  e.preventDefault();
  if(editor_mode == "css") { doAction("cancel-css"); }
  if(editor_mode == "md") { doAction("cancel-md"); }
  return false;
});

function doAction(action){
  switch (action) {
    case "apply-css":
      customstyles.textContent = css_editing_element.value;
      localStorage.setItem('css', css_editing_element.value);
      css_editor.classList.remove('visible');
      break;
    case "cancel-css":
      css_editor.classList.remove('visible');
      editor_mode = false;
      break;
    case "apply-md":
      var text = md_editing_element.value;
      localStorage.setItem('md', text);
      html = converter.makeHtml(text);
      document.querySelector('article').innerHTML = html;
      md_editor.classList.remove('visible');
      break;
    case "cancel-md":
      md_editor.classList.remove('visible');
      editor_mode = false;
      break;
  }
}


// shortcut keys
Mousetrap.bind(['t'], function(e) {
  if(editor_mode == false){
    e.preventDefault();
    openMdEditor()
    return false;
  }
});
Mousetrap.bind(['s'], function(e) {
  if(editor_mode == false){
    e.preventDefault();
    openCssEditor()
    return false;
  }
});
