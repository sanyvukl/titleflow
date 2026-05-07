package com.titleflow.application;

import com.titleflow.application.dto.CreateTitleApplicationRequest;
import com.titleflow.application.dto.TitleApplicationResponse;
import com.titleflow.application.dto.UpdateTitleApplicationRequest;
import com.titleflow.audit.AuditAction;
import com.titleflow.audit.AuditLogService;
import com.titleflow.owner.Owner;
import com.titleflow.owner.OwnerType;
import com.titleflow.owner.dto.OwnerRequest;
import com.titleflow.owner.dto.OwnerResponse;
import com.titleflow.user.User;
import com.titleflow.user.UserRepository;
import com.titleflow.vehicle.Vehicle;
import com.titleflow.vehicle.dto.VehicleRequest;
import com.titleflow.vehicle.dto.VehicleResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TitleApplicationService {

    private final TitleApplicationRepository titleApplicationRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public TitleApplicationService(
            TitleApplicationRepository titleApplicationRepository,
            UserRepository userRepository, AuditLogService auditLogService
    ) {
        this.titleApplicationRepository = titleApplicationRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public TitleApplicationResponse createDraft(
            CreateTitleApplicationRequest request,
            String dealerEmail
    ) {
        User dealer = findUserByEmail(dealerEmail);

        Vehicle vehicle = toVehicle(request.vehicle());
        Owner buyerOwner = toOwner(request.buyerOwner());
        Owner sellerOwner = toOwner(request.sellerOwner());

        TitleApplication application = new TitleApplication(
                generateApplicationNumber(),
                dealer,
                vehicle,
                buyerOwner,
                sellerOwner
        );

        TitleApplication savedApplication = titleApplicationRepository.save(application);

        auditLogService.recordApplicationAction(
                savedApplication,
                dealer,
                AuditAction.APPLICATION_CREATED,
                null,
                savedApplication.getStatus().name(),
                "Dealer created draft title application " + savedApplication.getApplicationNumber()
        );

        return toResponse(savedApplication);
    }

    @Transactional(readOnly = true)
    public List<TitleApplicationResponse> getMyApplications(String dealerEmail) {
        User dealer = findUserByEmail(dealerEmail);

        return titleApplicationRepository.findByDealerIdOrderByCreatedAtDesc(dealer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TitleApplicationResponse getMyApplicationById(Long applicationId, String dealerEmail) {
        User dealer = findUserByEmail(dealerEmail);

        TitleApplication application = titleApplicationRepository
                .findByIdAndDealerId(applicationId, dealer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Title application not found"));

        return toResponse(application);
    }

    @Transactional(readOnly = true)
    public List<TitleApplicationResponse> getApplicationsForDmvReview() {
        List<TitleApplicationStatus> reviewStatuses = List.of(
                TitleApplicationStatus.SUBMITTED,
                TitleApplicationStatus.UNDER_REVIEW,
                TitleApplicationStatus.NEEDS_MORE_INFO
        );

        return titleApplicationRepository
                .findByStatusInOrderByCreatedAtAsc(reviewStatuses)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TitleApplicationResponse getApplicationForDmvReview(Long applicationId) {
        TitleApplication application = findApplicationById(applicationId);

        return toResponse(application);
    }

    @Transactional
    public TitleApplicationResponse startReview(Long applicationId, String dmvClerkEmail) {
        User dmvClerk = findUserByEmail(dmvClerkEmail);

        TitleApplication application = findApplicationById(applicationId);

        TitleApplicationStatus oldStatus = application.getStatus();

        application.startReview();

        TitleApplication savedApplication = titleApplicationRepository.save(application);

        auditLogService.recordApplicationAction(
                savedApplication,
                dmvClerk,
                AuditAction.REVIEW_STARTED,
                oldStatus.name(),
                savedApplication.getStatus().name(),
                "DMV clerk started review for title application " + savedApplication.getApplicationNumber()
        );

        return toResponse(savedApplication);
    }

    @Transactional
    public TitleApplicationResponse requestMoreInfo(Long applicationId, String dmvClerkEmail) {
        User dmvClerk = findUserByEmail(dmvClerkEmail);

        TitleApplication application = findApplicationById(applicationId);

        TitleApplicationStatus oldStatus = application.getStatus();

        application.requestMoreInfo();

        TitleApplication savedApplication = titleApplicationRepository.save(application);

        auditLogService.recordApplicationAction(
                savedApplication,
                dmvClerk,
                AuditAction.MORE_INFO_REQUESTED,
                oldStatus.name(),
                savedApplication.getStatus().name(),
                "DMV clerk requested more information for title application " + savedApplication.getApplicationNumber()
        );

        return toResponse(savedApplication);
    }

    @Transactional
    public TitleApplicationResponse approveApplication(Long applicationId, String dmvClerkEmail) {
        User dmvClerk = findUserByEmail(dmvClerkEmail);

        TitleApplication application = findApplicationById(applicationId);

        TitleApplicationStatus oldStatus = application.getStatus();

        application.approve();

        TitleApplication savedApplication = titleApplicationRepository.save(application);

        auditLogService.recordApplicationAction(
                savedApplication,
                dmvClerk,
                AuditAction.APPLICATION_APPROVED,
                oldStatus.name(),
                savedApplication.getStatus().name(),
                "DMV clerk approved title application " + savedApplication.getApplicationNumber()
        );

        return toResponse(savedApplication);
    }

    @Transactional
    public TitleApplicationResponse rejectApplication(Long applicationId, String dmvClerkEmail) {
        User dmvClerk = findUserByEmail(dmvClerkEmail);

        TitleApplication application = findApplicationById(applicationId);

        TitleApplicationStatus oldStatus = application.getStatus();

        application.reject();

        TitleApplication savedApplication = titleApplicationRepository.save(application);

        auditLogService.recordApplicationAction(
                savedApplication,
                dmvClerk,
                AuditAction.APPLICATION_REJECTED,
                oldStatus.name(),
                savedApplication.getStatus().name(),
                "DMV clerk rejected title application " + savedApplication.getApplicationNumber()
        );

        return toResponse(savedApplication);
    }

    @Transactional
    public TitleApplicationResponse updateDraft(
            Long applicationId,
            UpdateTitleApplicationRequest request,
            String dealerEmail
    ) {
        User dealer = findUserByEmail(dealerEmail);

        TitleApplication application = titleApplicationRepository
                .findByIdAndDealerId(applicationId, dealer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Title application not found"));

        if (!application.isDraft()) {
            throw new IllegalArgumentException("Only draft applications can be updated");
        }

        application.setVehicle(toVehicle(request.vehicle()));
        application.setBuyerOwner(toOwner(request.buyerOwner()));
        application.setSellerOwner(toOwner(request.sellerOwner()));

        TitleApplication savedApplication = titleApplicationRepository.save(application);

        auditLogService.recordApplicationAction(
                savedApplication,
                dealer,
                AuditAction.APPLICATION_UPDATED,
                savedApplication.getStatus().name(),
                savedApplication.getStatus().name(),
                "Dealer updated draft title application " + savedApplication.getApplicationNumber()
        );

        return toResponse(savedApplication);
    }

    @Transactional
    public TitleApplicationResponse submitApplication(Long applicationId, String dealerEmail) {
        User dealer = findUserByEmail(dealerEmail);

        TitleApplication application = titleApplicationRepository
                .findByIdAndDealerId(applicationId, dealer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Title application not found"));

        if (!application.isDraft()) {
            throw new IllegalArgumentException("Only draft applications can be submitted");
        }

        TitleApplicationStatus oldStatus = application.getStatus();

        application.submit();

        TitleApplication savedApplication = titleApplicationRepository.save(application);

        auditLogService.recordApplicationAction(
                savedApplication,
                dealer,
                AuditAction.APPLICATION_SUBMITTED,
                oldStatus.name(),
                savedApplication.getStatus().name(),
                "Dealer submitted title application " + savedApplication.getApplicationNumber()
        );

        return toResponse(savedApplication);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
    }

    private TitleApplication findApplicationById(Long applicationId) {
        return titleApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Title application not found"));
    }

    private Vehicle toVehicle(VehicleRequest request) {
        return new Vehicle(
                normalizeVin(request.vin()),
                request.year(),
                trim(request.make()),
                trim(request.model()),
                trim(request.bodyType()),
                trim(request.color()),
                request.odometer()
        );
    }

    private Owner toOwner(OwnerRequest request) {
        validateOwnerRequest(request);

        return new Owner(
                trim(request.firstName()),
                trim(request.lastName()),
                trim(request.businessName()),
                trim(request.addressLine1()),
                trim(request.addressLine2()),
                trim(request.city()),
                normalizeState(request.state()),
                trim(request.zipCode()),
                trim(request.phone()),
                normalizeEmail(request.email()),
                request.ownerType()
        );
    }

    private void validateOwnerRequest(OwnerRequest request) {
        if (request.ownerType() == OwnerType.INDIVIDUAL) {
            if (!hasText(request.firstName()) || !hasText(request.lastName())) {
                throw new IllegalArgumentException(
                        "Individual owner must have first name and last name"
                );
            }
        }

        if (request.ownerType() == OwnerType.BUSINESS) {
            if (!hasText(request.businessName())) {
                throw new IllegalArgumentException(
                        "Business owner must have business name"
                );
            }
        }
    }

    private TitleApplicationResponse toResponse(TitleApplication application) {
        return new TitleApplicationResponse(
                application.getId(),
                application.getApplicationNumber(),
                application.getDealer().getId(),
                application.getDealer().getEmail(),
                application.getStatus(),
                toVehicleResponse(application.getVehicle()),
                toOwnerResponse(application.getBuyerOwner()),
                toOwnerResponse(application.getSellerOwner()),
                application.getSubmittedAt(),
                application.getReviewedAt(),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }

    private VehicleResponse toVehicleResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getVin(),
                vehicle.getYear(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getBodyType(),
                vehicle.getColor(),
                vehicle.getOdometer()
        );
    }

    private OwnerResponse toOwnerResponse(Owner owner) {
        return new OwnerResponse(
                owner.getId(),
                owner.getFirstName(),
                owner.getLastName(),
                owner.getBusinessName(),
                owner.getAddressLine1(),
                owner.getAddressLine2(),
                owner.getCity(),
                owner.getState(),
                owner.getZipCode(),
                owner.getPhone(),
                owner.getEmail(),
                owner.getOwnerType()
        );
    }

    private String generateApplicationNumber() {
        String datePart = LocalDate.now().toString().replace("-", "");
        String randomPart = UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();

        return "TF-" + datePart + "-" + randomPart;
    }

    private String normalizeVin(String vin) {
        return trim(vin).toUpperCase();
    }

    private String normalizeState(String state) {
        return trim(state).toUpperCase();
    }

    private String normalizeEmail(String email) {
        if (!hasText(email)) {
            return null;
        }

        return email.trim().toLowerCase();
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }

        return value.trim();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}