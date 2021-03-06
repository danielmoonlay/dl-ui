import { inject, bindable, BindingEngine, observable, computedFrom } from 'aurelia-framework'
var moment = require('moment');

@inject(BindingEngine, Element)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable error = {};

    constructor(bindingEngine, element) {
        this.bindingEngine = bindingEngine;
        this.element = element;
    }

    @computedFrom("data._id")
    get isEdit() {
        return (this.data._id || '').toString() != '';
    }

    bind() {
        if (this.data)
            this.flag = true;
        else
            this.flag = false;
    }

    unitPaymentOrderChanged(e) {
        var selectedPaymentOrder = e.detail || {};
        if (selectedPaymentOrder && !this.readOnly) {
            if (!this.readOnly)
                this.data.items = [];
            this.data.unitPaymentOrderId = selectedPaymentOrder._id;
            var _items = []
            if (selectedPaymentOrder.items) {
                for (var unitPaymentOrder of selectedPaymentOrder.items) {

                    for (var unitReceiptNoteItem of unitPaymentOrder.unitReceiptNote.items) {

                        var unitQuantityCorrectionNoteItem = {};
                        unitQuantityCorrectionNoteItem.purchaseOrder = unitReceiptNoteItem.purchaseOrder;
                        unitQuantityCorrectionNoteItem.purchaseOrderId = unitReceiptNoteItem.purchaseOrderId;
                        unitQuantityCorrectionNoteItem.product = unitReceiptNoteItem.product;
                        unitQuantityCorrectionNoteItem.productId = unitReceiptNoteItem.product._id;
                        unitQuantityCorrectionNoteItem.uom = unitReceiptNoteItem.deliveredUom;
                        unitQuantityCorrectionNoteItem.uomId = unitReceiptNoteItem.deliveredUom._id;
                        unitQuantityCorrectionNoteItem.pricePerUnit = unitReceiptNoteItem.pricePerDealUnit;
                        unitQuantityCorrectionNoteItem.currency = unitReceiptNoteItem.currency;
                        unitQuantityCorrectionNoteItem.currencyRate = unitReceiptNoteItem.currencyRate;
                        unitQuantityCorrectionNoteItem.unitReceiptNoteNo = unitPaymentOrder.unitReceiptNote.no;

                        if (unitReceiptNoteItem.correction) {
                            if (unitReceiptNoteItem.correction.length > 0) {
                                var _qty = 0;
                                var _hasQtyCorrection = false;
                                for (var correction of unitReceiptNoteItem.correction) {
                                    if (correction.correctionRemark === "Koreksi Jumlah") {
                                        _qty += correction.correctionQuantity;
                                        _hasQtyCorrection = true;
                                    }
                                }
                                if (!_hasQtyCorrection) {
                                    unitQuantityCorrectionNoteItem.quantity = unitReceiptNoteItem.correction[unitReceiptNoteItem.correction.length - 1].correctionQuantity;
                                    unitQuantityCorrectionNoteItem.pricePerUnit = unitReceiptNoteItem.correction[unitReceiptNoteItem.correction.length - 1].correctionPricePerUnit;
                                    unitQuantityCorrectionNoteItem.priceTotal = unitReceiptNoteItem.correction[unitReceiptNoteItem.correction.length - 1].correctionPriceTotal;
                                } else {
                                    unitQuantityCorrectionNoteItem.quantity = unitReceiptNoteItem.deliveredQuantity - _qty;
                                    unitQuantityCorrectionNoteItem.pricePerUnit = unitReceiptNoteItem.correction[unitReceiptNoteItem.correction.length - 1].correctionPricePerUnit;
                                    unitQuantityCorrectionNoteItem.priceTotal = unitReceiptNoteItem.correction[unitReceiptNoteItem.correction.length - 1].correctionPricePerUnit * unitQuantityCorrectionNoteItem.quantity;
                                }
                            } else {
                                unitQuantityCorrectionNoteItem.quantity = unitReceiptNoteItem.deliveredQuantity;
                                unitQuantityCorrectionNoteItem.pricePerUnit = unitReceiptNoteItem.pricePerDealUnit;
                                unitQuantityCorrectionNoteItem.priceTotal = unitReceiptNoteItem.pricePerDealUnit * unitReceiptNoteItem.deliveredQuantity;
                            }
                        } else {
                            unitQuantityCorrectionNoteItem.quantity = unitReceiptNoteItem.deliveredQuantity;
                            unitQuantityCorrectionNoteItem.pricePerUnit = unitReceiptNoteItem.pricePerDealUnit;
                            unitQuantityCorrectionNoteItem.priceTotal = unitReceiptNoteItem.pricePerDealUnit * unitReceiptNoteItem.deliveredQuantity;
                        }
                        _items.push(unitQuantityCorrectionNoteItem);
                    }
                }
                this.data.items = _items;
            }
            else {
                this.data.items = [];
            }
        }
        else {
            this.data.items = [];
        }
    }
} 