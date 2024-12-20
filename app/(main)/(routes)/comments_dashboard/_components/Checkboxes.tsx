'use client'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useCommentDashboardContext } from '../_context/CommentDashboardContext'

const Checkboxes = () => {

  const { setShowApprovedComments, setShowCommentsPendingApproval, setShowDeniedComments, showApprovedComments, showCommentsPendingApproval, showDeniedComments } = useCommentDashboardContext();

  // Handle checkbox change and update context directly
  const handleApprovedChange = (checked: boolean) => {
    setShowApprovedComments(checked);
  };

  const handlePendingApprovalChange = (checked: boolean) => {
    setShowCommentsPendingApproval(checked);
  };

  const handleDeniedChange = (checked: boolean) => {
    setShowDeniedComments(checked);
  };

  return (
    <div className="sticky top-0 flex items-center space-x-6 p-2 bg-white text-gray-900 rounded-md shadow-md">
      {/* Show Approved Comments */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="approvedComments"
          checked={showApprovedComments}
          onCheckedChange={handleApprovedChange}
          className="text-sm"
        />
        <Label htmlFor="approvedComments" className="text-sm">Show Approved Comments</Label>
      </div>

      {/* Show Pending Approval Comments */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="pendingApprovalComments"
          checked={showCommentsPendingApproval}
          onCheckedChange={handlePendingApprovalChange}
          className="text-sm"
        />
        <Label htmlFor="pendingApprovalComments" className="text-sm">Show Comments Pending Approval</Label>
      </div>

      {/* Show Denied Comments */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="deniedComments"
          checked={showDeniedComments}
          onCheckedChange={handleDeniedChange}
          className="text-sm"
        />
        <Label htmlFor="deniedComments" className="text-sm">Show Denied Comments</Label>
      </div>
    </div>
  );
}

export default Checkboxes;
