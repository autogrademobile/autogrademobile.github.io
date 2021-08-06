// CSS and SASS files
import './index.scss';

import Tobi from 'rqrauhvmra__tobi'
const tobi = new Tobi()

/*
// Remove the two following lines to remove the product hunt floating prompt
import FloatingPrompt from 'producthunt-floating-prompt'
FloatingPrompt({ name: 'Mobile App Landing Page', url: 'https://www.producthunt.com/posts/mobile-app-landing-page', bottom: '96px', width: '450px' })

// Remove the following lines to remove the darkmode js
import Darkmode from 'darkmode-js'
function addDarkmodeWidget() {
  new Darkmode().showWidget()
}
window.addEventListener('load', addDarkmodeWidget)
*/

var current_lang = localStorage.getItem('current_lang');
if (typeof(current_lang) !== 'string') {
  function getBestSuitableSupportedLang(lang, locale, supported) {
    // Exclude first element, default language
    var supported_lang = supported.shift();
    
    if (supported.includes(lang + "-" + locale)) {
      supported_lang = lang + "-" + locale;
    } else if (supported.includes(lang)) {
      supported_lang = lang;
    }
  
    return supported_lang;
  }
  var [lang, locale] = (((navigator.userLanguage || navigator.language).replace('-', '_')).toLowerCase()).split('_');
  var supported_languages = ['en', 'vi'];
  var suitable_lang = getBestSuitableSupportedLang(lang, locale, supported_languages);
  localStorage.setItem('current_lang', suitable_lang);
  window.location = '/' + suitable_lang + '/';
}
