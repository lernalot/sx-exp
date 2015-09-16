<div class="all-container">
  <div class="m-ewallet-order" data-mod-config='{"fundId":"${ewalletPurchaseViewDto.fundId!""}", "fundCode":"${ewalletPurchaseViewDto.fundCode!""}", "productTypeId":"${ewalletPurchaseViewDto.productTypeId!""}","earnReleaseDate":"${ewalletPurchaseViewDto.earnReleaseDate!""}","cardLimit":"${ewalletPurchaseViewDto.cardLimit!""}","csrf_token":"${csrfToken}","realNameUrl":"/athena/authCheck.htm","ewalletPurchaseUrl":"ewalletPurchase.htm"}'>
    <div class="obj-profit">
       <div class="profit-sign">
          <div class="qblogo"></div>
          <ul class="sign-list">
            <li class="list-product">华夏货币基金</li>
            <li class="list-use">安全可靠</li>
            <li class="list-use">灵活支付</li>
          </ul>
          <div class="profit-seven-day">
            <p class="proco">七日年化收益率<p>
            <#if (ewalletPurchaseViewDto.yieldRate)??>
             <p><em class="value-seven">${ewalletPurchaseViewDto.yieldRate}</em><span class="unit-seven">%</span></p>
            <#else>
            <p><em class="value-seven"></em><span class="unit-seven">收益暂未更新</span></p>
            </#if>
          </div>
          <div class="profit-much">
            <p class="proco">万份收益<p>
            <#if (ewalletPurchaseViewDto.millionRate)??>
            <p class="profit-amount"><em class="value-much">${ewalletPurchaseViewDto.millionRate?number?string("0.0000")}</em><span class="unit-much">元</span></p>
            <#else>
            <p class="profit-amount"><em class="value-much"></em><span class="unit-much">收益暂未更新</span></p>
            </#if>
          </div>                 
       </div>
       <div class="profit-statement">
         <p>当天15:00之前转入，第二个工作日开始计算收益</p>
         <p>当天15:00之后转入，则延迟一个工作日开始计算（工作日除去周六周日以及节假日）</p>
       </div>
    </div>
    <div class="obj-order">
        <p class="titleword"><span class="blackword">易钱袋余额：</span><span class="balance">${(ewalletPurchaseViewDto.amount?number?string("0.00"))!"0.00"}</span>元<#if ewalletPurchaseViewDto.amount?? && ewalletPurchaseViewDto.amount?number lt 100>(建议持有金额在<span class="blackword">100</span>元以上)</#if></p>
        <div class="obj-area">
          <div class="u-input">
            <input class="in-amount" id="js-hold-amount" type="text" placeholder="转入金额" name="transferInAmount"/>
            <span class="price-unit">元</span>
          </div>
          <p class="issuedate">预计收益发放日期：${ewalletPurchaseViewDto.earnReleaseDate}</p>
          <div class="banks u-tip">
              <p class="u-tip-header" id="js-bank-limit"><a class="link-banks" href="javascript:;" title="限额说明">限额说明</a></p>
              <div class="u-tip-content" id="js-hide-list">
                  <table>
                      <tr>
                          <th class="bank-name">支持银行名称</th>
                          <th class="per-time">单笔限额</th>
                          <th class="per-day">每日限额</th>
                      </tr>
                  </table>
                  <div class="u-tip-container">
                      <table>
                          <#list ewalletPurchaseViewDto.shownBankList  as bank>
                          <tr>
                              <td class="bank-name"><p><i class="icon-bank iconfont icon-bank-${bank.bankId}">
                            <#switch bank.bankId>
                                <#case "0003">&#xe605;<#break>
                                <#case "0002">&#xe602;<#break>
                                <#case "0001">&#xe600;<#break>
                                <#case "0004">&#xe601;<#break>
                                <#case "0009">&#xe606;<#break>
                                <#case "0006">&#xe604;<#break>
                                <#case "0008">&#xe608;<#break>
                                <#case "0007">&#xe603;<#break>
                                <#case "0077">&#xe607;<#break>
                                <#case "0014">&#xe617;<#break>
                                <#case "0016">&#xe615;<#break>
                                <#case "0011">&#xe618;<#break>
                                <#case "0005">&#xe619;<#break>
                                <#case "0022">&#xe61c;<#break>
                                <#case "0013">&#xe61d;<#break>
                                <#case "0078">&#xe61a;<#break>
                            </#switch>
                              </i><span>${bank.bankNameCn}</span></p></td>
                              <td class="per-time"><#if bank.bankRuleDto.singleTradingLimit?? && bank.bankRuleDto.singleTradingLimit != ""><#if bank.bankRuleDto.singleTradingLimit?number gte 10000><em class="value">${bank.bankRuleDto.singleTradingLimit?number/10000}</em>万<#else><em class="value">${bank.bankRuleDto.singleTradingLimit}</em>元</#if><#else>无限额</#if></td>
                              <td class="per-day"><#if bank.bankRuleDto.dailyTradingLimit?? && bank.bankRuleDto.dailyTradingLimit != ""><#if bank.bankRuleDto.dailyTradingLimit?number gte 10000><em class="value">${bank.bankRuleDto.dailyTradingLimit?number/10000}</em>万<#else><em class="value">${bank.bankRuleDto.dailyTradingLimit}</em>元</#if><#else>无限额</#if></td>
                          </tr>
                          </#list>
                      </table>
                  </div>
                  <i class="icon-arrow"><em></em><span></span></i>
              </div>
          </div>
        </div>
        <div class="obj-operator">
          <a href="#" id="js-trinCount" class="trin-count" title="立即转入">立即转入</a>
          <p class="error-msg"></p>
          <p class="readagree">我同意<a class="help-area" href="${fundStyleDomain}/modern/agreement/ewalletIn/zrxy.pdf" target="_blank" title="易钱袋实时划转服务协议">《易钱袋实时划转服务协议》</a></p>
        </div>          
    </div>
  </div>
  <div class="m-ewallet-qa">
   <div class="qa-container">
    <h2>常见问题</h2>
    <ul>
      <li>
          <h3>购买易钱袋会有风险吗?</h3>
          <p>答：您通过易钱袋购买的是网易理财为用户精心挑选的货币基金产品。货币型基金是一种开放式基金，资产主要投资于国债、央行票据、银行定期存单、同业存款等安全性高、 收益稳定的有价证券。由于货币基金投资的范围都是一些高安全系数和稳定收益的品种，在通常情况下既能获得高于银行存款利息的收益，但货币基金并不保障本金的安全。</p>
      </li>
      <li>
          <h3 class="qut">易钱袋最低可以转入多少钱?</h3>
          <p>答：易钱袋单笔转入金额为0.01元。根据基金行业历史经验，建议您持有100元以上。</p>
      </li>
    </ul>   
  </div>
</div>
