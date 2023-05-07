%lang starknet
from starkware.cairo.common.uint256 import Uint256

@contract_interface
namespace everai_mirror  {
    func tokenURI(token_id: Uint256) -> (tokenURI_len: felt, tokenURI: felt*) {
    }

    func  name() -> (res: felt) {
    }

    func symbol() -> (res: felt) {
    }
}

@external
func test_proxy_contract{syscall_ptr: felt*, range_check_ptr}() {
    alloc_locals;

    local contract_address: felt;
    // We deploy contract and put its address into a local variable. Second argument is calldata array
    %{ ids.contract_address = deploy_contract("./src/main.cairo", [427824581996521952334490376445324901, 5391409,486246126474359946192348700142268263967120013078464126154508728538516568533, 3,184555836509371486644298270517380613565396767415278678887948391494588524912,181013377130045435659890581909640190867353010602592517226438742938315085926,2194400143691614193218323824727442803459257903, 199354445678]).contract_address %}

    let (res) = everai_mirror.name(contract_address=contract_address);
    assert res = 427824581996521952334490376445324901;

    

    return ();
}