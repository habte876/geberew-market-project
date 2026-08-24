-- USERS: everyone can see their own row; operators/admins can see all
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (
    id::text = current_setting('app.current_user_id', true)
    OR current_setting('app.current_role', true) IN ('operator', 'admin')
  );

CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (id::text = current_setting('app.current_user_id', true));

-- PRICES: farmers/buyers see only verified prices; operators/admins see everything
CREATE POLICY prices_select_verified ON prices
  FOR SELECT
  USING (
    is_verified = true
    OR current_setting('app.current_role', true) IN ('operator', 'admin')
  );

-- Only operators/admins can submit or verify prices
CREATE POLICY prices_write_operator ON prices
  FOR INSERT
  WITH CHECK (current_setting('app.current_role', true) IN ('operator', 'admin'));

CREATE POLICY prices_update_operator ON prices
  FOR UPDATE
  USING (current_setting('app.current_role', true) IN ('operator', 'admin'));

-- LISTINGS: farmers manage their own; buyers/operators see active ones; operators see all
CREATE POLICY listings_select ON listings
  FOR SELECT
  USING (
    farmer_id::text = current_setting('app.current_user_id', true)
    OR status = 'active'
    OR current_setting('app.current_role', true) IN ('operator', 'admin')
  );

CREATE POLICY listings_insert_own ON listings
  FOR INSERT
  WITH CHECK (farmer_id::text = current_setting('app.current_user_id', true));

CREATE POLICY listings_update_own ON listings
  FOR UPDATE
  USING (farmer_id::text = current_setting('app.current_user_id', true));

-- INQUIRIES: buyers create their own; farmers see inquiries on their listings
CREATE POLICY inquiries_insert_own ON inquiries
  FOR INSERT
  WITH CHECK (buyer_id::text = current_setting('app.current_user_id', true));

CREATE POLICY inquiries_select ON inquiries
  FOR SELECT
  USING (
    buyer_id::text = current_setting('app.current_user_id', true)
    OR listing_id IN (
      SELECT id FROM listings WHERE farmer_id::text = current_setting('app.current_user_id', true)
    )
    OR current_setting('app.current_role', true) IN ('operator', 'admin')
  );

-- SMS_MESSAGES: operators/admins only
CREATE POLICY sms_operator_only ON sms_messages
  FOR ALL
  USING (current_setting('app.current_role', true) IN ('operator', 'admin'));