## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| dist/FriendlyCrowdsale.dist.sol | 23659f27196a26232a25617770746dbbeff74bda |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **Context** | Implementation |  |||
| └ | <Constructor> | Internal 🔒 | 🛑  | |
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
| **Address** | Library |  |||
| └ | isContract | Internal 🔒 |   | |
| └ | sendValue | Internal 🔒 | 🛑  | |
||||||
| **SafeERC20** | Library |  |||
| └ | safeTransfer | Internal 🔒 | 🛑  | |
| └ | safeTransferFrom | Internal 🔒 | 🛑  | |
| └ | safeApprove | Internal 🔒 | 🛑  | |
| └ | safeIncreaseAllowance | Internal 🔒 | 🛑  | |
| └ | safeDecreaseAllowance | Internal 🔒 | 🛑  | |
| └ | _callOptionalReturn | Private 🔐 | 🛑  | |
||||||
| **ReentrancyGuard** | Implementation |  |||
| └ | <Constructor> | Internal 🔒 | 🛑  | |
||||||
| **EnumerableSet** | Library |  |||
| └ | _add | Private 🔐 | 🛑  | |
| └ | _remove | Private 🔐 | 🛑  | |
| └ | _contains | Private 🔐 |   | |
| └ | _length | Private 🔐 |   | |
| └ | _at | Private 🔐 |   | |
| └ | add | Internal 🔒 | 🛑  | |
| └ | remove | Internal 🔒 | 🛑  | |
| └ | contains | Internal 🔒 |   | |
| └ | length | Internal 🔒 |   | |
| └ | at | Internal 🔒 |   | |
| └ | add | Internal 🔒 | 🛑  | |
| └ | remove | Internal 🔒 | 🛑  | |
| └ | contains | Internal 🔒 |   | |
| └ | length | Internal 🔒 |   | |
| └ | at | Internal 🔒 |   | |
||||||
| **AccessControl** | Implementation | Context |||
| └ | hasRole | Public ❗️ |   |NO❗️ |
| └ | getRoleMemberCount | Public ❗️ |   |NO❗️ |
| └ | getRoleMember | Public ❗️ |   |NO❗️ |
| └ | getRoleAdmin | Public ❗️ |   |NO❗️ |
| └ | grantRole | Public ❗️ | 🛑  |NO❗️ |
| └ | revokeRole | Public ❗️ | 🛑  |NO❗️ |
| └ | renounceRole | Public ❗️ | 🛑  |NO❗️ |
| └ | _setupRole | Internal 🔒 | 🛑  | |
| └ | _setRoleAdmin | Internal 🔒 | 🛑  | |
| └ | _grantRole | Private 🔐 | 🛑  | |
| └ | _revokeRole | Private 🔐 | 🛑  | |
||||||
| **Roles** | Implementation | AccessControl |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
||||||
| **FriendlyCrowdsale** | Implementation | Context, ReentrancyGuard, Roles |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | <Receive Ether> | External ❗️ |  💵 |NO❗️ |
| └ | token | Public ❗️ |   |NO❗️ |
| └ | wallet | Public ❗️ |   |NO❗️ |
| └ | rate | Public ❗️ |   |NO❗️ |
| └ | weiRaised | Public ❗️ |   |NO❗️ |
| └ | cap | Public ❗️ |   |NO❗️ |
| └ | capReached | Public ❗️ |   |NO❗️ |
| └ | openingTime | Public ❗️ |   |NO❗️ |
| └ | closingTime | Public ❗️ |   |NO❗️ |
| └ | isOpen | Public ❗️ |   |NO❗️ |
| └ | hasClosed | Public ❗️ |   |NO❗️ |
| └ | finalized | Public ❗️ |   |NO❗️ |
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
| └ | buyTokens | Public ❗️ |  💵 | nonReentrant |
| └ | enable | Public ❗️ | 🛑  | onlyOperator |
| └ | reject | Public ❗️ | 🛑  | onlyOperator |
| └ | finalize | Public ❗️ | 🛑  |NO❗️ |
| └ | claimRefund | Public ❗️ | 🛑  |NO❗️ |
| └ | setExpiredAndWithdraw | Public ❗️ | 🛑  | onlyOperator |
| └ | _preValidatePurchase | Internal 🔒 |   | |
| └ | _postValidatePurchase | Internal 🔒 |   | |
| └ | _deliverTokens | Internal 🔒 | 🛑  | |
| └ | _processPurchase | Internal 🔒 | 🛑  | |
| └ | _updatePurchasingState | Internal 🔒 | 🛑  | |
| └ | _getTokenAmount | Internal 🔒 |   | |
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
