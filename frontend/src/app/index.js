// Highlight JS
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.css';
import {storeHighlightJs} from '@skeletonlabs/skeleton';
import xml from 'highlight.js/lib/languages/xml'; // for HTML
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
// Floating UI for Popups
import {computePosition, autoUpdate, flip, shift, offset, arrow} from '@floating-ui/dom';
import {storePopup} from '@skeletonlabs/skeleton';

hljs.registerLanguage('xml', xml); // for HTML
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
storeHighlightJs.set(hljs);
storePopup.set({computePosition, autoUpdate, flip, shift, offset, arrow});






