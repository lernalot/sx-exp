<!DOCTYPE html>
<html>
<head>
    <#include "../../layout/meta.ftl">
    <@meta title="易钱袋－转出"></@meta>
    <link rel="stylesheet" href="${fundStyleDomain}/modern/css/business/ewallet-transfer-outsucc/0.0.1/transfer-out-succ.css?${versionId}">
</head>
<body>
    <div class="ewallet-transfer-outsucc">
        <#include "../../layout/header.ftl">
        <@header productName="易钱袋"></@header>
        <#include "../../screen/ewallet/transfer-out-succ.ftl">
        <#include "../../layout/footer.ftl">
    </div>
    
<script type="text/javascript">
seajs.use([
    'business/common/0.0.1/topbar.js'
]);
</script>
<#include "../../layout/analytics.ftl">
</body>
</html>