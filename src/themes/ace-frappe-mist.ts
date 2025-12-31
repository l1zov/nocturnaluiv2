/* eslint-disable @typescript-eslint/no-explicit-any */

ace.define(
  'ace/theme/frappe_mist',
  ['require', 'exports', 'module', 'ace/lib/dom'],
  function (acequire: any, exports: any, _module: any) {
    exports.isDark = true;
    exports.cssClass = 'ace-frappe-mist';
    exports.cssText = `
.ace-frappe-mist .ace_gutter {
  background: #2E2A3E;
  color: #626880;
}

.ace-frappe-mist .ace_print-margin {
  width: 1px;
  background: #4F4F70;
}

.ace-frappe-mist {
  background-color: #2E2A3E;
  color: #CAD3F5;
}

.ace-frappe-mist .ace_cursor {
  color: #CAD3F5;
}

.ace-frappe-mist .ace_marker-layer .ace_selection {
  background: #3E3A56;
}

.ace-frappe-mist.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #2E2A3E;
}

.ace-frappe-mist .ace_marker-layer .ace_step {
  background: rgba(129,200,190,0.25);
}

.ace-frappe-mist .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #626880;
}

.ace-frappe-mist .ace_marker-layer .ace_active-line {
  background: #36344A;
}

.ace-frappe-mist .ace_gutter-active-line {
  background-color: #36344A;
}

.ace-frappe-mist .ace_marker-layer .ace_selected-word {
  border: 1px solid #4F4F70;
}

.ace-frappe-mist .ace_invisible {
  color: #4F4F70;
}

.ace-frappe-mist .ace_keyword,
.ace-frappe-mist .ace_meta,
.ace-frappe-mist .ace_storage,
.ace-frappe-mist .ace_storage.ace_type {
  color: #E78284;
}

.ace-frappe-mist .ace_keyword.ace_operator {
  color: #CAD3F5;
}

.ace-frappe-mist .ace_constant.ace_character,
.ace-frappe-mist .ace_constant.ace_language,
.ace-frappe-mist .ace_constant.ace_numeric,
.ace-frappe-mist .ace_keyword.ace_other.ace_unit,
.ace-frappe-mist .ace_support.ace_constant,
.ace-frappe-mist .ace_variable.ace_parameter {
  color: #A6C8D9;
}

.ace-frappe-mist .ace_constant.ace_other {
  color: #CAD3F5;
}

.ace-frappe-mist .ace_invalid {
  color: #CAD3F5;
  background-color: #E78284;
}

.ace-frappe-mist .ace_invalid.ace_deprecated {
  color: #CAD3F5;
  background-color: #E78284;
}

.ace-frappe-mist .ace_fold {
  background-color: #81C8BE;
  border-color: #CAD3F5;
}

.ace-frappe-mist .ace_entity.ace_name.ace_function,
.ace-frappe-mist .ace_support.ace_function,
.ace-frappe-mist .ace_variable {
  color: #CAD3F5;
}

.ace-frappe-mist .ace_support.ace_class,
.ace-frappe-mist .ace_support.ace_type {
  color: #81C8BE;
}

.ace-frappe-mist .ace_heading,
.ace-frappe-mist .ace_markup.ace_heading,
.ace-frappe-mist .ace_string {
  color: #A6D189;
}

.ace-frappe-mist .ace_entity.ace_name.ace_tag,
.ace-frappe-mist .ace_entity.ace_other.ace_attribute-name,
.ace-frappe-mist .ace_meta.ace_tag,
.ace-frappe-mist .ace_string.ace_regexp,
.ace-frappe-mist .ace_variable {
  color: #81C8BE;
}

.ace-frappe-mist .ace_comment {
  color: #626880;
}

.ace-frappe-mist .ace_indent-guide {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y;
}

.ace-frappe-mist .ace_indent-guide-active {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYLh1598/AAa0An3ypYHIAAAAAElFTkSuQmCC) right repeat-y;
}

.ace-frappe-mist .ace_selection .ace_start {
  box-shadow: 0 0 0 2px rgba(198,208,245,0.45);
  border-radius: 3px;
}
`;

    const dom = acequire('ace/lib/dom');
    dom.importCssString(exports.cssText, exports.cssClass, false);
  }
);
