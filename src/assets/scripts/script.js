$(document).ready(function () {
    $(".giftItem").hover(
        function () {
            $(this).addClass("giftItemBoxShadow");
            $(this).find(".giftItemCardOuter").addClass("giftItemCardOuterBorder");
            $(this).find(".btnGiftItemAddToCart").addClass("btnGiftItemAddToCartShow");
        },
        function () {
            $(this).removeClass("giftItemBoxShadow");
            $(this).find(".giftItemCardOuter").removeClass("giftItemCardOuterBorder");
            $(this).find(".btnGiftItemAddToCart").removeClass("btnGiftItemAddToCartShow");
        }
    );
    $(".recipientsListRecipientName").click(function () {
        var chk = $(this).find(".chk");        
        if(chk.prop("checked"))
        {
            //Checked
            $(this).find(".chk").prop('checked', false);
            $(this).find(".iconUncheck").addClass("iconUncheckShow");
            $(this).find(".iconCheck").removeClass("iconCheckShow");
        }
        else
        {
            //Unchecked
            $(this).find(".chk").prop('checked', true);
            $(this).find(".iconUncheck").removeClass("iconUncheckShow");
            $(this).find(".iconCheck").addClass("iconCheckShow");
        }
    });	
});
