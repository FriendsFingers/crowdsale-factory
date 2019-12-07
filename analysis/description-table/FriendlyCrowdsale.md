## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| dist/FriendlyCrowdsale.dist.sol | 8fbcdcdc9c2257a55393ea748920dc75631a9f4c |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **SafeMath** | Library |  |||
| └ | add | Internal 🔒 |   | |
| └ | sub | Internal 🔒 |   | |
| └ | sub | Internal 🔒 |   | |
| └ | mul | Internal 🔒 |   | |
| └ | div | Internal 🔒 |   | |
| └ | div | Internal 🔒 |   | |
| └ | mod | Internal 🔒 |   | |
| └ | mod | Internal 🔒 |   | |
||||||
| **Context** | Implementation |  |||
| └ | \<Constructor\> | Internal 🔒 | 🛑  | |
| └ | _msgSender | Internal 🔒 |   | |
| └ | _msgData | Internal 🔒 |   | |
||||||
| **IERC20** | Interface |  |||
| └ | totalSupply | External ❗️ |   |NO❗️ |
| └ | balanceOf | External ❗️ |   |NO❗️ |
| └ | transfer | External ❗️ | 🛑  |NO❗️ |
| └ | allowance | External ❗️ |   |NO❗️ |
| └ | approve | External ❗️ | 🛑  |NO❗️ |
| └ | transferFrom | External ❗️ | 🛑  |NO❗️ |
||||||
| **Address** | Library |  |||
| └ | isContract | Internal 🔒 |   | |
| └ | toPayable | Internal 🔒 |   | |
| └ | sendValue | Internal 🔒 | 🛑  | |
||||||
| **SafeERC20** | Library |  |||
| └ | safeTransfer | Internal 🔒 | 🛑  | |
| └ | safeTransferFrom | Internal 🔒 | 🛑  | |
| └ | safeApprove | Internal 🔒 | 🛑  | |
| └ | safeIncreaseAllowance | Internal 🔒 | 🛑  | |
| └ | safeDecreaseAllowance | Internal 🔒 | 🛑  | |
| └ | callOptionalReturn | Private 🔐 | 🛑  | |
||||||
| **ReentrancyGuard** | Implementation |  |||
| └ | \<Constructor\> | Internal 🔒 | 🛑  | |
||||||
| **Crowdsale** | Implementation | Context, ReentrancyGuard |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | \<Fallback\> | External ❗️ |  💵 |NO❗️ |
| └ | token | Public ❗️ |   |NO❗️ |
| └ | wallet | Public ❗️ |   |NO❗️ |
| └ | rate | Public ❗️ |   |NO❗️ |
| └ | weiRaised | Public ❗️ |   |NO❗️ |
| └ | buyTokens | Public ❗️ |  💵 | nonReentrant |
| └ | _preValidatePurchase | Internal 🔒 |   | |
| └ | _postValidatePurchase | Internal 🔒 |   | |
| └ | _deliverTokens | Internal 🔒 | 🛑  | |
| └ | _processPurchase | Internal 🔒 | 🛑  | |
| └ | _updatePurchasingState | Internal 🔒 | 🛑  | |
| └ | _getTokenAmount | Internal 🔒 |   | |
| └ | _forwardFunds | Internal 🔒 | 🛑  | |
||||||
| **TimedCrowdsale** | Implementation | Crowdsale |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | openingTime | Public ❗️ |   |NO❗️ |
| └ | closingTime | Public ❗️ |   |NO❗️ |
| └ | isOpen | Public ❗️ |   |NO❗️ |
| └ | hasClosed | Public ❗️ |   |NO❗️ |
| └ | _preValidatePurchase | Internal 🔒 |   | onlyWhileOpen |
| └ | _extendTime | Internal 🔒 | 🛑  | |
||||||
| **FinalizableCrowdsale** | Implementation | TimedCrowdsale |||
| └ | \<Constructor\> | Internal 🔒 | 🛑  | |
| └ | finalized | Public ❗️ |   |NO❗️ |
| └ | finalize | Public ❗️ | 🛑  |NO❗️ |
| └ | _finalization | Internal 🔒 | 🛑  | |
||||||
| **CappedCrowdsale** | Implementation | Crowdsale |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | cap | Public ❗️ |   |NO❗️ |
| └ | capReached | Public ❗️ |   |NO❗️ |
| └ | _preValidatePurchase | Internal 🔒 |   | |
||||||
| **Roles** | Library |  |||
| └ | add | Internal 🔒 | 🛑  | |
| └ | remove | Internal 🔒 | 🛑  | |
| └ | has | Internal 🔒 |   | |
||||||
| **OperatorRole** | Implementation |  |||
| └ | \<Constructor\> | Internal 🔒 | 🛑  | |
| └ | isOperator | Public ❗️ |   |NO❗️ |
| └ | addOperator | Public ❗️ | 🛑  | onlyOperator |
| └ | renounceOperator | Public ❗️ | 🛑  |NO❗️ |
| └ | _addOperator | Internal 🔒 | 🛑  | |
| └ | _removeOperator | Internal 🔒 | 🛑  | |
||||||
| **FriendlyCrowdsale** | Implementation | FinalizableCrowdsale, CappedCrowdsale, OperatorRole |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Crowdsale TimedCrowdsale CappedCrowdsale |
| └ | feeWallet | Public ❗️ |   |NO❗️ |
| └ | feePerMille | Public ❗️ |   |NO❗️ |
| └ | goal | Public ❗️ |   |NO❗️ |
| └ | state | Public ❗️ |   |NO❗️ |
| └ | started | Public ❗️ |   |NO❗️ |
| └ | ended | Public ❗️ |   |NO❗️ |
| └ | goalReached | Public ❗️ |   |NO❗️ |
| └ | investorsNumber | Public ❗️ |   |NO❗️ |
| └ | investorExists | Public ❗️ |   |NO❗️ |
| └ | getInvestorAddress | Public ❗️ |   |NO❗️ |
| └ | weiContribution | Public ❗️ |   |NO❗️ |
| └ | enable | Public ❗️ | 🛑  | onlyOperator |
| └ | reject | Public ❗️ | 🛑  | onlyOperator |
| └ | claimRefund | Public ❗️ | 🛑  |NO❗️ |
| └ | setExpiredAndWithdraw | Public ❗️ | 🛑  | onlyOperator |
| └ | _preValidatePurchase | Internal 🔒 |   | |
| └ | _updatePurchasingState | Internal 🔒 | 🛑  | |
| └ | _finalization | Internal 🔒 | 🛑  | |
| └ | _forwardFunds | Internal 🔒 | 🛑  | |
| └ | _close | Internal 🔒 | 🛑  | |
| └ | _enableRefunds | Internal 🔒 | 🛑  | |
| └ | _recoverRemainingTokens | Internal 🔒 | 🛑  | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
