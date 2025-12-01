/* eslint-disable @typescript-eslint/no-explicit-any */
declare const ace: any;

ace.define(
  'ace/theme/default_dark',
  ['require', 'exports', 'module', 'ace/lib/dom'],
  function (acequire: any, exports: any, _module: any) {
    exports.isDark = true;
    exports.cssClass = 'ace-default-dark';
    exports.cssText = `
.ace-default-dark .ace_gutter {
  background: #0d0d0d;
  color: #666666;
}

.ace-default-dark .ace_print-margin {
  width: 1px;
  background: #202020;
}

.ace-default-dark {
  background-color: #0d0d0d;
  color: #f7f7f7;
}

.ace-default-dark .ace_cursor {
  color: #f7f7f7;
}

.ace-default-dark .ace_marker-layer .ace_selection {
  background: #333333;
}

.ace-default-dark.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #0d0d0d;
}

.ace-default-dark .ace_marker-layer .ace_step {
  background: rgb(102, 82, 0);
}

.ace-default-dark .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #404040;
}

.ace-default-dark .ace_marker-layer .ace_active-line {
  background: #1a1a1a;
}

.ace-default-dark .ace_gutter-active-line {
  background-color: #1a1a1a;
}

.ace-default-dark .ace_marker-layer .ace_selected-word {
  border: 1px solid #333333;
}

.ace-default-dark .ace_invisible {
  color: #404040;
}

.ace-default-dark .ace_keyword,
.ace-default-dark .ace_meta,
.ace-default-dark .ace_storage,
.ace-default-dark .ace_storage.ace_type {
  color: #c586c0;
}

.ace-default-dark .ace_keyword.ace_operator {
  color: #d4d4d4;
}

.ace-default-dark .ace_constant.ace_character,
.ace-default-dark .ace_constant.ace_language,
.ace-default-dark .ace_constant.ace_numeric,
.ace-default-dark .ace_keyword.ace_other.ace_unit,
.ace-default-dark .ace_support.ace_constant,
.ace-default-dark .ace_variable.ace_parameter {
  color: #b5cea8;
}

.ace-default-dark .ace_constant.ace_other {
  color: #f7f7f7;
}

.ace-default-dark .ace_invalid {
  color: #f7f7f7;
  background-color: #dc2626;
}

.ace-default-dark .ace_invalid.ace_deprecated {
  color: #f7f7f7;
  background-color: #dc2626;
}

.ace-default-dark .ace_fold {
  background-color: #569cd6;
  border-color: #f7f7f7;
}

.ace-default-dark .ace_entity.ace_name.ace_function,
.ace-default-dark .ace_support.ace_function,
.ace-default-dark .ace_variable {
  color: #dcdcaa;
}

.ace-default-dark .ace_support.ace_class,
.ace-default-dark .ace_support.ace_type {
  color: #4ec9b0;
}

.ace-default-dark .ace_heading,
.ace-default-dark .ace_markup.ace_heading,
.ace-default-dark .ace_string {
  color: #ce9178;
}

.ace-default-dark .ace_entity.ace_name.ace_tag,
.ace-default-dark .ace_entity.ace_other.ace_attribute-name,
.ace-default-dark .ace_meta.ace_tag,
.ace-default-dark .ace_string.ace_regexp,
.ace-default-dark .ace_variable {
  color: #9cdcfe;
}

.ace-default-dark .ace_comment {
  color: #6a9955;
}

.ace-default-dark .ace_indent-guide {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y;
}

.ace-default-dark .ace_indent-guide-active {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYLh1598/AAa0An3ypYHIAAAAAElFTkSuQmCC) right repeat-y;
}
`;

    const dom = acequire('ace/lib/dom');
    dom.importCssString(exports.cssText, exports.cssClass, false);
  }
);

