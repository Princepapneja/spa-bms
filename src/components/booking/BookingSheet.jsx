import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Sheet from "../utils/sheet";
import CustomSelect from "../utils/CustomSelect";
import Inputs from "../utils/Inputs";
import { useGetUsersQuery } from "../../store/features/customersApiSlice";
import { useGetServiceCategoriesQuery } from "../../store/features/serviceApiSlice";
import { useGetRoomBookingsQuery } from "../../store/features/roomApiSlice";
import { useCreateBookingMutation } from "../../store/features/bookingApiSlice";
import { toast } from "react-toastify";

const BookingSheet = ({ openSheet, setOpenSheet, selectedSlot }) => {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    customer: null,
    service: null,
    selectedService: null,
  });

  const [services, setServices] = useState([]);

  // Handle select/input change
  const handleChange = (e) => {
    const { name, value, item } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Item`]: item || null,
    }));
  };

  // Get selected service details
  const selectedServiceDetails = useMemo(() => {
    return formData?.serviceItem?.services?.find(
      (s) => s.id === Number(formData?.selectedService)
    );
  }, [formData]);

  // Service dropdown options
  const servicesOptions = useMemo(() => {
    return (
      formData?.serviceItem?.services?.map((s) => ({
        name: `${s.name} - ${s.duration} mins`,
        value: s.id,
        item: s,
      })) || []
    );
  }, [formData?.serviceItem]);

  // Add service (with chaining time)
  const addService = () => {
    if (!selectedServiceDetails || !selectedSlot?.date) return;

    const last = services[services.length - 1];

    let start;

    if (last) {
      start = new Date(`2026-01-01T${last.end_time}`);
    } else {
      start = new Date(selectedSlot.date);
    }

    const end = new Date(
      start.getTime() + selectedServiceDetails.duration * 60000
    );

    const newService = {
      id: selectedServiceDetails.id,
      name: selectedServiceDetails.name,
      duration: selectedServiceDetails.duration,
      therapist: selectedSlot?.therapist,
      start_time: start.toTimeString().slice(0, 5),
      end_time: end.toTimeString().slice(0, 5),
      room: "Auto Assign",
      price: selectedServiceDetails.price,
    };

    setServices((prev) => [...prev, newService]);

    // reset selected service
    setFormData((prev) => ({
      ...prev,
      selectedService: null,
      selectedServiceItem: null,
    }));
  };

  // Remove service
  const removeService = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  // Total price
  const totalPrice = services.reduce((sum, s) => sum + (s.price || 0), 0);

  // Submit payload
  const handleSubmit = async () => {
  // if (!validate()) {
  //   toast.error("Please fix the validation errors");
  //   return;
  // }
  debugger
const room= roomsOptions.find(r=>r.value ==  formData?.room)?.item;
  const payload = {
    outlet: user?.outlet_id,
    customer: formData.customer,
    company: 1,
    source: formData.source || "",
    membership: formData.membership || 0,
    booking_type: 1,
    payment_type: "payatstore",
    service_at: selectedSlot.date,
    items: services.map((s, index) => ({
      service: s.id,
      start_time: s.start_time,
      end_time: s.end_time,
      duration: s.duration,
      therapist: s.therapist?.id,
      price: s.price,
      quantity: s.quantity||1,
      service_request: s.service_request || "",
      commission: s.commission || null,
      customer_name: formData?.customerItem?.name || "",
      primary: 1,
      item_number:1,
      // transform room selection into room_segments
      room_segments: s?.room
        ? [
            {
              room_id: Number(room?.room_id),       // selected room id
              item_type: room?.item_category || null,        // e.g., "single-bed"
              meta_service: null,                  // optional, can be null
              start_time: s.start_time,
              end_time: s.end_time,
              duration: s.duration,
              priority: 1,
            },
          ]
        : [],
    })),
  };

  try {
    await createBooking(payload).unwrap();
    toast.success("Booking created successfully!");
    setOpenSheet(false);
  } catch (error) {
    const msg = error?.data?.message || "Failed to create booking";
    toast.error(msg);
  }
};
const formatDate = (date) => {
  if(!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
const [createBooking] = useCreateBookingMutation();
const {data:rooms}= useGetRoomBookingsQuery({
    outlet_id: user?.outlet_id,
    date: formatDate(selectedSlot?.date), // "07-03-2026"
    duration: selectedServiceDetails?.duration,
    pagination: 1,
    service_at: `${formatDate(selectedSlot?.date)} ${selectedSlot?.time}`, // "07-03-2026 07:30"
  }, { skip: !selectedSlot?.date || !selectedServiceDetails?.duration })
  const roomsOptions = useMemo(() => {
    return rooms?.data?.map((r) => ({
      name: r.room_name,
      value: r.room_id,
      item: r,
    })) || [];
  }, [rooms]);
  return (
    <Sheet
      onClose={() => setOpenSheet(false)}
      title="New Booking"
      open={openSheet}
    >
      <div className="space-y-4">

        {/* Outlet */}
        <div className="px-3 text-sm text-gray-500">
          Outlet: <span className="font-medium">{user?.outlet_name}</span>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 px-3 text-sm">
          <div>
            On:{" "}
            {selectedSlot?.date
              ? new Date(selectedSlot.date).toLocaleDateString()
              : "-"}
          </div>
          <div>
            At:{" "}
            {selectedSlot?.date
              ? new Date(selectedSlot.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </div>
        </div>

        {/* Customer */}
        <div className="px-3">
          <CustomSelect
            label="Customer"
            name="customer"
            value={formData?.customer}
            onChange={handleChange}
            hook={useGetUsersQuery}
            params={{ pagination: 1 }}
            dataKey="users"
          />
        </div>

        {/* Service Selection */}
        <div className="border-t pt-3 px-3 space-y-3">
          <h3 className="text-sm text-gray-500">Add Service</h3>

          <CustomSelect
            label="Service Category"
            name="service"
            value={formData?.service}
            onChange={handleChange}
            hook={useGetServiceCategoriesQuery}
            params={{ pagination: 1 }}
            dataKey="category"
          />

          {servicesOptions.length > 0 && (
            <Inputs
              type="select"
              label="Service"
              name="selectedService"
              value={formData?.selectedService}
              onChange={handleChange}
              options={servicesOptions}
            />
          )}
      <Inputs
  label="Service Room"
  name="room"
  options={roomsOptions}
  value={formData?.room}
  onChange={handleChange}
  type="select"
  // params={}

  dataKey="rooms"
/>
          <button
            type="button"
            onClick={addService}
            className="bg-blue-600 text-white px-3 py-2 rounded w-full"
          >
            + Add Service
          </button>
        </div>

        {/* Services List */}
        <div className="border-t px-3 pt-3">
          <h3 className="text-sm text-gray-500 mb-2">Services</h3>

          {services.length === 0 && (
            <p className="text-sm text-gray-400">No services added</p>
          )}

          {services.map((s, index) => (
            <div
              key={index}
              className="border-b py-3 flex justify-between items-start"
            >
              <div className="space-y-1 text-sm">
                <div className="font-medium">{s.name}</div>

                <div className="text-gray-500">
                  With: {s.therapist?.name || "-"}
                </div>

                <div className="text-gray-500">
                  {s.duration} mins | {s.start_time} - {s.end_time}
                </div>

                <div className="text-gray-400">
                  Room: {s.room}
                </div>
              </div>

              <button
                onClick={() => removeService(index)}
                className="text-gray-400 hover:text-red-500"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Total */}
        {services.length > 0 && (
          <div className="px-3 flex justify-between font-medium">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        )}

        {/* Notes */}
        <div className="px-3">
          <textarea
            placeholder="Add note..."
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        {/* Submit */}
        <div className="px-3">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            Create Booking
          </button>
        </div>
      </div>
    </Sheet>
  );
};

export default BookingSheet;