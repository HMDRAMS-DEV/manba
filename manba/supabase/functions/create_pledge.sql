-- Create a function to handle pledge creation and project amount update in a transaction
create or replace function create_pledge(
  p_amount float,
  p_project_id uuid,
  p_email text,
  p_name text,
  p_message text,
  p_anonymous boolean
) returns json as $$
declare
  v_pledge record;
  v_project record;
begin
  -- Verify project exists
  select * into v_project
  from projects
  where id = p_project_id
  for update;  -- Lock row for update

  if not found then
    raise exception 'Project not found';
  end if;

  -- Start transaction
  begin
    -- Create pledge record
    insert into pledges (
      amount,
      project_id,
      email,
      name,
      message,
      anonymous,
      status
    ) values (
      p_amount,
      p_project_id,
      p_email,
      p_name,
      nullif(trim(p_message), ''),  -- Convert empty string to null
      p_anonymous,
      'completed'
    ) returning * into v_pledge;

    -- Update project amount
    update projects
    set current_amount = current_amount + p_amount
    where id = p_project_id;

    -- Return the created pledge
    return json_build_object(
      'id', v_pledge.id,
      'amount', v_pledge.amount,
      'status', v_pledge.status
    );
  exception 
    when others then
      -- Rollback will happen automatically
      raise exception 'Failed to process pledge: %', SQLERRM;
  end;
end;
$$ language plpgsql security definer;
