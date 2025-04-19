import { Dialog } from "@headlessui/react";
import {
  Form,
  useActionData,
  useNavigation,
  useOutlet,
  useOutletContext,
} from "@remix-run/react";
import type { CustomerAddressInput } from "@shopify/hydrogen/customer-account-api-types";
import type {
  AddressFragment,
  CustomerFragment,
} from "customer-accountapi.generated";
import { useEffect, useState } from "react";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/checkbox";
import { Input } from "~/components/input";
import { IconClose } from "../Icon";

function AddressCard(props: {
  address: AddressFragment;
  defaultAddress?: boolean;
}) {
  let { address, defaultAddress } = props;
  console.log("🚀 ~ address:", address);
  return (
    <div className="space-y-2 border border-bar-subtle p-5">
      {defaultAddress && (
        <div className="w-fit rounded bg-label-soldout-background px-2.5 py-1 text-white">
          Default
        </div>
      )}
      <p className="font-semibold">
        {address.firstName} {address.lastName}
      </p>
      <p>{address.address1}</p>
      <p>
        {address.city}, {address.territoryCode}
      </p>
      <p>{address.zip}</p>
      <p></p>
      <p>{address.phoneNumber}</p>
      <div className="flex gap-1">
        <EditAddress address={address} />
        <Form id={address.id}>
          <input type="hidden" name="addressId" defaultValue={address.id} />
          <Button
            variant="link"
            formMethod="DELETE"
            type="submit"
            className="ml-2.5 p-0"
          >
            Remove
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default function Addresses() {
  const outlet = useOutlet();
  const { customer } = useOutletContext<{ customer: CustomerFragment }>();
  console.log("🚀 ~ customer3:", customer);
  const { defaultAddress, addresses: _addresses } = customer;
  let addresses = _addresses.nodes.filter(
    (address) => address.id !== defaultAddress?.id,
  );

  // if (outlet)
  //   return (
  //     <div>
  //       <Outlet />
  //     </div>
  //   );

  return (
    <div className="account-addresses">
      <h2 className="text-xl">Address Book</h2>
      <NewAddress />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AddressCard address={defaultAddress} defaultAddress />
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  );
}

function AddressPopup({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/60 p-4">
        <Dialog.Panel className="w-full max-w-[446px] space-y-4 border bg-white p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title>{title}</Dialog.Title>
            <button
              type="button"
              className="-m-4 p-4 text-foreground transition"
              onClick={onClose}
              data-test="close-cart"
            >
              <IconClose aria-label="Close panel" />
            </button>
          </div>

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function NewAddress() {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="mb-5 mt-4" onClick={() => setIsOpen(true)}>
        Add new address
      </Button>
      <AddressPopup
        title="Add new address"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <NewAddressForm onClose={() => setIsOpen(false)} />
      </AddressPopup>
    </>
  );
}

function EditAddress({ address }: { address: AddressFragment }) {
  let [isOpen, setIsOpen] = useState(false);
  let onClose = () => setIsOpen(false);
  return (
    <>
      <Button variant="link" onClick={() => setIsOpen(true)} className="p-0">
        Edit
      </Button>
      <AddressPopup title="Edit address" open={isOpen} onClose={onClose}>
        <AddressForm
          addressId={address.id}
          address={address}
          onSucess={onClose}
          defaultAddress={null}
        >
          {({ stateForMethod }) => (
            <div className="space-x-3 text-right">
              <Button
                disabled={stateForMethod("PUT") !== "idle"}
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={stateForMethod("PUT") !== "idle"}
                formMethod="PUT"
                type="submit"
                loading={stateForMethod("PUT") !== "idle"}
              >
                Save
              </Button>
            </div>
          )}
        </AddressForm>
      </AddressPopup>
    </>
  );
}

function NewAddressForm({ onClose }: { onClose: () => void }) {
  const newAddress = {
    address1: "",
    address2: "",
    city: "",
    company: "",
    territoryCode: "",
    firstName: "",
    id: "new",
    lastName: "",
    phoneNumber: "",
    zoneCode: "",
    zip: "",
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={"NEW_ADDRESS_ID"}
      address={newAddress}
      onSucess={onClose}
      defaultAddress={null}
    >
      {({ stateForMethod }) => (
        <div className="space-x-3 text-right">
          <Button
            disabled={stateForMethod("PUT") !== "idle"}
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            disabled={stateForMethod("POST") !== "idle"}
            formMethod="POST"
            type="submit"
            loading={stateForMethod("POST") !== "idle"}
          >
            Save
          </Button>
        </div>
      )}
    </AddressForm>
  );
}

type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  onSucess,
  children,
}: {
  addressId: AddressFragment["id"];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment["defaultAddress"];
  onSucess?: () => void;
  children: (props: {
    stateForMethod: (
      method: "PUT" | "POST" | "DELETE",
    ) => ReturnType<typeof useNavigation>["state"];
  }) => React.ReactNode;
}) {
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[0];
  const isDefaultAddress = defaultAddress?.id === addressId;
  useEffect(() => {
    if (state === "loading" && action) {
      onSucess?.();
    }
  }, [action, state]);
  return (
    <Form id={addressId}>
      <fieldset className="space-y-3">
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <Input
          aria-label="First name"
          autoComplete="given-name"
          defaultValue={address?.firstName ?? ""}
          id="firstName"
          name="firstName"
          placeholder="First name"
          required
          type="text"
        />
        <Input
          aria-label="Last name"
          autoComplete="family-name"
          defaultValue={address?.lastName ?? ""}
          id="lastName"
          name="lastName"
          placeholder="Last name"
          required
          type="text"
        />
        <Input
          aria-label="Company"
          autoComplete="organization"
          defaultValue={address?.company ?? ""}
          id="company"
          name="company"
          placeholder="Company"
          type="text"
        />
        <Input
          aria-label="Address line 1"
          autoComplete="address-line1"
          defaultValue={address?.address1 ?? ""}
          id="address1"
          name="address1"
          placeholder="Address line 1*"
          required
          type="text"
        />
        <Input
          aria-label="Address line 2"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ""}
          id="address2"
          name="address2"
          placeholder="Address line 2"
          type="text"
        />
        <Input
          aria-label="City"
          autoComplete="address-level2"
          defaultValue={address?.city ?? ""}
          id="city"
          name="city"
          placeholder="City"
          required
          type="text"
        />
        {/* <Input
          aria-label="State/Province"
          autoComplete="address-level1"
          defaultValue={address?.zoneCode ?? ''}
          id="zoneCode"
          name="zoneCode"
          placeholder="State / Province"
          required
          type="text"
        /> */}
        <Input
          aria-label="Zip"
          autoComplete="postal-code"
          defaultValue={address?.zip ?? ""}
          id="zip"
          name="zip"
          placeholder="Zip / Postal Code"
          required
          type="text"
        />
        <Input
          aria-label="territoryCode"
          autoComplete="country"
          defaultValue={address?.territoryCode ?? ""}
          id="territoryCode"
          name="territoryCode"
          placeholder="Country"
          required
          type="text"
          maxLength={2}
        />
        <Input
          aria-label="Phone Number"
          autoComplete="tel"
          defaultValue={address?.phoneNumber ?? ""}
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Phone Number"
          pattern="^\+?[1-9]\d{3,14}$"
          type="tel"
        />
        <div className="flex gap-2">
          <Checkbox
            id="defaultAddress"
            name="defaultAddress"
            defaultChecked={isDefaultAddress}
          />
          <span>Set as default address</span>
        </div>
        {error ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        {children({
          stateForMethod: (method) => (formMethod === method ? state : "idle"),
        })}
      </fieldset>
    </Form>
  );
}
