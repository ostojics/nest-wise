const AccountsListEmpty = () => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">No accounts found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first account to get started with managing your finances.
        </p>
      </div>
    </div>
  );
};

export default AccountsListEmpty;
