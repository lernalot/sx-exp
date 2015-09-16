<!DOCTYPE html>
<html>
<head>
    <#include "../../layout/meta.ftl">
    <@meta title="易钱袋－转出"></@meta>
    <link rel="stylesheet" href="${fundStyleDomain}/modern/css/business/ewallet-transfer-out/0.0.1/transfer-out.css?${versionId}">
</head>
<body>
    <div class="ewallet-transfer-out">
        <#include "../../layout/header.ftl">
        <@header productName="易钱袋"></@header>
        <#include "../../screen/ewallet/transfer-out.ftl">
        <#include "../../layout/footer.ftl">
    </div>
    
<script type="text/javascript">
seajs.use([
    'business/common/0.0.1/topbar.js',
    'business/ewallet-transfer-out/0.0.1/transfer-out.js'
]);
</script>
<#include "../../layout/analytics.ftl">
</body>
</html>