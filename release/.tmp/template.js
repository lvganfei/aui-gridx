angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid-body',
    "<div class=\"gridxMain\" role=\"presentation\"><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" ng-show=\"renderedRows.length === 0\">this is the empty body</div><div class=\"gridxBody\" role=\"presentation\" tabindex=\"0\" ng-class=\"{gridxBodyRowHoverEffect: grid.enableRowHoverEffect}\"><div aui-grid-row ng-repeat=\"row in renderedRows\" row=\"row\"></div></div><!-- \t<div class=\"gridxVScroller\"tabindex=\"-1\">\r" +
    "\n" +
    "\t\t<div style='width: 1px;'></div>\r" +
    "\n" +
    "\t</div> --></div>"
  );


  $templateCache.put('aui-grid/aui-grid-cell',
    "aui-grid-cell.html"
  );


  $templateCache.put('aui-grid/aui-grid-footer',
    "<div class=\"gridxFooter\" data-dojo-attach-point=\"footerNode\"><!-- \t<div class=\"gridxHScroller\">\r" +
    "\n" +
    "\t\t<div class=\"gridxHScrollerInner\" data-dojo-attach-point=\"hScrollerNode\" tabindex=\"-1\" style=\"\">\r" +
    "\n" +
    "\t\t\t<div style=\"\"></div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div> --></div>"
  );


  $templateCache.put('aui-grid/aui-grid-header',
    "<div class=\"gridxHeader\" role=\"presentation\"><div class=\"gridxHeaderRow\"><div class=\"gridxHeaderRowInner\" role=\"row\" ng-class=\"{hasVScroller: grid.hasVScroller}\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"cell in headerCells\" aria-readonly=\"true\" role=\"gridcell\" tabindex=\"-1\" aria-describedby=\"grid-id\" colid=\"{{cell.colId}}\" class=\"gridxCell {{cell.domClass}}\" style=\"{{cell.style}}\" ng-class=\"{sortable: cell.sortable}\">{{cell.content}}<div role=\"presentation\" tabindex=\"0\" class=\"gridxArrowButtonNode gridxArrowUp\" ng-show=\"cell.sorting > 0\"><div class=\"gridxArrowButtonChar\">&#9652;</div></div><div role=\"presentation\" tabindex=\"0\" class=\"gridxArrowButtonNode gridxArrowDown\" ng-show=\"cell.sorting < 0\"><div class=\"gridxArrowButtonChar\">&#9662;</div></div></td></tr></tbody></table></div></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid-pagination-bar',
    "<div class=\"gridx-pagination-bar\"><div class=\"gridx-pagination-bar-container\"><div class=\"gridx-pagination-bar-control\"><button type=\"button\" ng-click=\"paginationApi.goto(1)\" class=\"firstPage\" ng-disabled=\"cantPageBackward()\"><div class=\"first-triangle\"><div class=\"first-bar\"></div></div></button> <button type=\"button\" ng-click=\"paginationApi.previous()\" class=\"previous\" ng-disabled=\"cantPageBackward()\"><div class=\"first-triangle prev-triangle\"></div></button> <input type=\"number\" ng-model=\"grid.currentPage\" class=\"currentPage\" min=\"1\" max=\"{{ paginationApi.pageCount() }}\" required> <span class=\"gridx-pagination-max-pages-number\" ng-show=\"paginationApi.pageCount() > 0\">/ {{ paginationApi.pageCount() }}</span> <button type=\"button\" ng-click=\"paginationApi.next()\" class=\"next\" ng-disabled=\"cantPageForward()\"><div class=\"last-triangle next-triangle\"></div></button> <button type=\"button\" ng-click=\"paginationApi.goto(paginationApi.pageCount())\" class=\"last\" ng-disabled=\"cantPageToLast()\"><div class=\"last-triangle\"><div class=\"last-bar\"></div></div></button></div><div class=\"gridx-pagination-bar-sizes\"><select ng-model=\"grid.paginationPageSize\" ng-options=\"o as o for o in paginationPageSizes\"></select><!-- <span class=\"ui-grid-pager-row-count-label\">&nbsp;{{sizesLabel}}</span> --><span class=\"gridx-pagination-count-label\">&nbsp;items per page</span></div></div><div class=\"ui-grid-pager-count-container\"><div class=\"ui-grid-pager-count\"><span ng-show=\"grid.options.totalItems > 0\">{{showingLow}} - {{showingHigh}} of {{grid.options.totalItems}} {{totalItemsLabel}}</span></div></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid-row',
    "<div class=\"gridxRow\" role=\"row\" visualindex=\"0\" rowid=\"0\" rowindex=\"0\" parentid=\"\"><table class=\"gridxRowTable\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"col in columns\" class=\"gridxCell\" aui-grid-cell field=\"col.field\" row=\"row\" col-id=\"col.id\" col=\"col\"></td></tr></tbody></table></div>"
  );


  $templateCache.put('aui-grid/aui-grid',
    "<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\" aria-label=\"grid\"><div class=\"gridxLoad\"></div><div aui-grid-header></div><div aui-grid-body></div><div aui-grid-footer></div><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span></div>"
  );

}]);
