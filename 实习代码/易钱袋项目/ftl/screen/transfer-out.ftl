<div class="trasfer-out-content" data-mod-config='{"parentOrderId":"${ewalletRedeemViewDto.parentOrderId!""}","transferDate":"${ewalletRedeemViewDto.transferDate!""}","redeemAmount":"${ewalletRedeemViewDto.amount?number?string("0.00")}","redeemTimes":"${ewalletRedeemViewDto.redeemTimes!""}","submitUrl":"ewalletRedeem.htm","csrf_token":"${csrfToken}","flag":"${t0Flag!""}","messageUrl":"/newfund/sendAuthCode.htm"}'>
  <dl>
    <dt class="wallet-balance">易钱袋余额：</dt>
    <dd class="wallet-remain"><em class="balance-count">${ewalletRedeemViewDto.amount?number?string("0.00")}</em>元</dd>
  </dl>
  <dl class="bank-card">
        <dt class="out-safe-card">转出至安全卡：</dt>
        <dd class="card-type">
                <i class="iconfont icon-bank icon-bank-${ewalletRedeemViewDto.bankId}">
                <#switch ewalletRedeemViewDto.bankId>
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
                </i>
        <span>${ewalletRedeemViewDto.bankName!""}</span><p class="card-number">尾号：${ewalletRedeemViewDto.cardNo!""}</p></dd>
    <dd class="state-bind">您已绑定安全卡，若要使用其他银行卡需赎回所有金额后更换</dd>
  </dl>
  <dl class="redeem-pattern">
    <dt class="redeem-model">赎回模式：</dt>
    <dd class="ordinary redeem">
        <div id="js-ordinary" class="model-selected">
          <div class="check"><input type="radio" name="odinary" id="js-ordinary-select" value="1" checked /><label for="ordinary-select">普通赎回</label>
          </div>
        </div>
      <p class="ordinary-arrival">${ewalletRedeemViewDto.transferDate}（不含）之前均可享受收益</p>
    </dd>
    <dd class="fast redeem g-container">
      <div id="js-fast" class="check-select model-selected">
        <div class="check"><input type="radio" name="odinary" id="js-fast-select" value="0" /><label for="fast-select">快速赎回</label></div>  
      </div>
      <p class="fast-arrival">每日最多3次，每次最多10000元</em></p>
    </dd>
  </dl>
  <dl class="estimate-arrival">
    <dt class="arrival-title">预计到账时间：</dt>
    <dd class="arrival-time">${ewalletRedeemViewDto.transferDate}</dd>
  </dl>
  <dl class="transfer-out-count">
    <dt class="out-count">转出金额：</dt>
    <dd class="out-input"><input type="text" class="out-amount normal-border" placeholder="转出金额"  data-form-config='{"postName":"transferInAmount"}' /><p class="company">元</p></dd>
    <dd class="hide-format"><p class="format-check"></p></dd>
    <dd class="allow-count">本次可提取金额：<em class="value">${ewalletRedeemViewDto.amount?number?string("0.00")}</em>元</dd>
  </dl>
  <dl class="message-code">
    <dt class="message-state">短信验证码：</dt>
    <dd class="get-message">
      <a class="code-get message-get" title="获取验证码">获取验证码</a><input type="text" class="message-place" />
    </dd>
    <dd class="err-construct"><p class="j-sms-err"></p></dd>
    <dd class="number-place"><div class="phone-number">短信验证码已发送至：${ewalletRedeemViewDto.phoneNumber}</div></dd>
    <dd><a href="http://help.epay.163.com/showdetails.html?dirid=2013121014DT29893494&pageNum=8&qId=2015090214HQ42771799#2015090214HQ42771799" target="_blank" title="没有收到短信?" class="non-message">没有收到短信?</a></dd>
  </dl>
  <dl class="submit disabled" id="js-submit">
    <dd><a class="submit-area" title="提交">提交</a></dd>
    <dd><p class="error-msg"></p></dd>
  </dl>
</div>