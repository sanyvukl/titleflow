import jsPDF from "jspdf";

interface VehicleInfo {
    vin: string;
    year: number;
    make: string;
    model: string;
    bodyType: string | null;
    color: string | null;
    odometer: number | null;
}

interface OwnerInfo {
    firstName: string | null;
    lastName: string | null;
    businessName: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    phone: string | null;
    email: string | null;
    ownerType: "INDIVIDUAL" | "BUSINESS";
}

interface ApprovedTitleApplication {
    applicationNumber: string;
    status: string;
    vehicle: VehicleInfo;
    buyerOwner: OwnerInfo;
    sellerOwner: OwnerInfo;
    reviewedAt: string | null;
}

function getOwnerDisplayName(owner: OwnerInfo): string {
    if (owner.ownerType === "BUSINESS") {
        return owner.businessName ?? "N/A";
    }

    return `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() || "N/A";
}

function getOwnerAddress(owner: OwnerInfo): string {
    return [
        owner.addressLine1,
        owner.addressLine2,
        owner.city,
        owner.state,
        owner.zipCode,
    ]
        .filter(Boolean)
        .join(", ");
}

function addLabelValue(
    doc: jsPDF,
    label: string,
    value: string | number | null | undefined,
    x: number,
    y: number
) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    doc.text(String(value ?? "N/A"), x + 48, y);
}

export function downloadGeneratedTitlePdf(application: ApprovedTitleApplication) {
    const doc = new jsPDF();

    const issueDate = application.reviewedAt
        ? new Date(application.reviewedAt).toLocaleDateString()
        : new Date().toLocaleDateString();

    const issuingState = application.buyerOwner.state || "OH";

    doc.setFillColor(8, 43, 85);
    doc.rect(0, 0, 210, 32, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TitleFlow Generated Title Certificate", 14, 16);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Training Copy - Not an Official Government Title", 14, 24);

    doc.setTextColor(11, 37, 69);

    let y = 46;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Certificate Information", 14, y);

    y += 10;

    doc.setFontSize(10);
    addLabelValue(doc, "Title Number", application.applicationNumber, 14, y);
    y += 8;
    addLabelValue(doc, "Issue Date", issueDate, 14, y);
    y += 8;
    addLabelValue(doc, "Issuing State", issuingState, 14, y);
    y += 8;
    addLabelValue(doc, "Status", application.status, 14, y);

    y += 16;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Issuing Bureau", 14, y);

    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("TitleFlow Bureau of Motor Vehicles", 14, y);
    y += 7;
    doc.text("Digital Title Services Division", 14, y);
    y += 7;
    doc.text(`100 State Records Plaza, ${issuingState}`, 14, y);

    y += 16;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Information", 14, y);

    y += 10;

    doc.setFontSize(10);
    addLabelValue(doc, "VIN", application.vehicle.vin, 14, y);
    y += 8;
    addLabelValue(
        doc,
        "Vehicle",
        `${application.vehicle.year} ${application.vehicle.make} ${application.vehicle.model}`,
        14,
        y
    );
    y += 8;
    addLabelValue(doc, "Body Style", application.vehicle.bodyType, 14, y);
    y += 8;
    addLabelValue(doc, "Color", application.vehicle.color, 14, y);
    y += 8;
    addLabelValue(doc, "Odometer", application.vehicle.odometer, 14, y);

    y += 16;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("New Owner / Buyer", 14, y);

    y += 10;

    doc.setFontSize(10);
    addLabelValue(doc, "Name", getOwnerDisplayName(application.buyerOwner), 14, y);
    y += 8;
    addLabelValue(doc, "Owner Type", application.buyerOwner.ownerType, 14, y);
    y += 8;
    addLabelValue(doc, "Address", getOwnerAddress(application.buyerOwner), 14, y);
    y += 8;
    addLabelValue(doc, "Phone", application.buyerOwner.phone, 14, y);
    y += 8;
    addLabelValue(doc, "Email", application.buyerOwner.email, 14, y);

    y += 16;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Previous Owner / Seller", 14, y);

    y += 10;

    doc.setFontSize(10);
    addLabelValue(doc, "Name", getOwnerDisplayName(application.sellerOwner), 14, y);
    y += 8;
    addLabelValue(doc, "Owner Type", application.sellerOwner.ownerType, 14, y);
    y += 8;
    addLabelValue(doc, "Address", getOwnerAddress(application.sellerOwner), 14, y);
    y += 8;
    addLabelValue(doc, "Phone", application.sellerOwner.phone, 14, y);
    y += 8;
    addLabelValue(doc, "Email", application.sellerOwner.email, 14, y);

    doc.setFontSize(8);
    doc.setTextColor(91, 100, 114);
    doc.text(
        "Generated by TitleFlow for portfolio/demo workflow purposes only.",
        14,
        286
    );

    doc.save(`TITLE-${application.applicationNumber}.pdf`);
}