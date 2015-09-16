<!DOCTYPE html>
<html>
<head>
    <#include "../../layout/meta.ftl">
    <@meta title="易钱袋－转入"></@meta>
    <link rel="stylesheet" href="${fundStyleDomain}/modern/css/business/transfer-process/0.0.1/transfer-process.css?${versionId}">
</head>
<body>
    <div class="ewallet-transfer-process">
        <#include "../../layout/header.ftl">
        <@header productName="易钱袋"></@header>
        <#include "../../screen/ewallet/transfer-in-process.ftl">
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